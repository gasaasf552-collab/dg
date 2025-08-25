import React, { useState, useEffect, useMemo } from 'react'
import { packageService, promoCodeService, leadService, clientService, projectService, transactionService, getUserIdFromPortalAccess } from '../lib/supabase-service'
import { Package, AddOn, PromoCode, Client, Project, Transaction, Lead, ClientStatus, PaymentStatus, TransactionType, LeadStatus, ContactChannel, ClientType, BookingStatus } from '../types'
import Modal from './Modal'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = error => reject(error)
})

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

interface PublicSupabaseBookingProps {
  vendorId: string
}

const PublicSupabaseBooking: React.FC<PublicSupabaseBookingProps> = ({ vendorId }) => {
  const [packages, setPackages] = useState<Package[]>([])
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    instagram: '',
    projectType: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    selectedAddOnIds: [] as string[],
    promoCode: '',
    dp: '',
    dpPaymentRef: ''
  })

  const [promoFeedback, setPromoFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    loadData()
  }, [vendorId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [packagesData, promoCodesData] = await Promise.all([
        packageService.getPublicPackages(vendorId),
        promoCodeService.getPublicPromoCodes(vendorId)
      ])
      
      setPackages(packagesData)
      setPromoCodes(promoCodesData)
      
      // For demo purposes, we'll use empty add-ons since they're not in the public API yet
      setAddOns([])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const { totalBeforeDiscount, discountAmount, totalProject, discountText } = useMemo(() => {
    if (!selectedPackage) return { totalBeforeDiscount: 0, discountAmount: 0, totalProject: 0, discountText: '' }

    const packagePrice = selectedPackage.price
    const addOnsPrice = addOns
      .filter(addon => formData.selectedAddOnIds.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0)
    
    const totalBeforeDiscount = packagePrice + addOnsPrice
    let discountAmount = 0
    let discountText = ''

    const enteredPromoCode = formData.promoCode.toUpperCase().trim()
    if (enteredPromoCode) {
      const promoCode = promoCodes.find(p => p.code === enteredPromoCode && p.isActive)
      if (promoCode) {
        const isExpired = promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()
        const isMaxedOut = promoCode.maxUsage != null && promoCode.usageCount >= promoCode.maxUsage

        if (!isExpired && !isMaxedOut) {
          if (promoCode.discountType === 'percentage') {
            discountAmount = (totalBeforeDiscount * promoCode.discountValue) / 100
            discountText = `${promoCode.discountValue}%`
          } else {
            discountAmount = promoCode.discountValue
            discountText = formatCurrency(promoCode.discountValue)
          }
          setPromoFeedback({ type: 'success', message: `Kode promo diterapkan! Diskon ${discountText}.` })
        } else {
          setPromoFeedback({ type: 'error', message: 'Kode promo tidak valid atau sudah habis.' })
        }
      } else {
        setPromoFeedback({ type: 'error', message: 'Kode promo tidak ditemukan.' })
      }
    } else {
      setPromoFeedback({ type: '', message: '' })
    }
    
    const totalProject = totalBeforeDiscount - discountAmount
    return { totalBeforeDiscount, discountAmount, totalProject, discountText }
  }, [selectedPackage, formData.selectedAddOnIds, formData.promoCode, addOns, promoCodes])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const { id, checked } = e.target as HTMLInputElement
      setFormData(prev => ({ 
        ...prev, 
        selectedAddOnIds: checked 
          ? [...prev.selectedAddOnIds, id] 
          : prev.selectedAddOnIds.filter(addOnId => addOnId !== id) 
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file tidak boleh melebihi 10MB.')
        e.target.value = ''
        return
      }
      setPaymentProof(file)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPackage) return

    setIsSubmitting(true)

    try {
      const dpAmount = Number(formData.dp) || 0
      let promoCodeAppliedId: string | undefined

      if (discountAmount > 0 && formData.promoCode) {
        const promoCode = promoCodes.find(p => p.code === formData.promoCode.toUpperCase().trim())
        if (promoCode) {
          promoCodeAppliedId = promoCode.id
          await promoCodeService.updatePromoCodeUsage(promoCode.id)
        }
      }

      let dpProofUrl = ''
      if (paymentProof) {
        dpProofUrl = await toBase64(paymentProof)
      }

      const selectedAddOns = addOns.filter(addon => formData.selectedAddOnIds.includes(addon.id))
      const remainingPayment = totalProject - dpAmount

      // Create client
      const newClient = await clientService.createClient({
        name: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone,
        instagram: formData.instagram,
        clientType: ClientType.DIRECT,
        status: ClientStatus.ACTIVE,
        since: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString(),
        portalAccessId: crypto.randomUUID()
      })

      // Create project
      const newProject = await projectService.createProject({
        projectName: `Acara ${formData.clientName}`,
        clientName: newClient.name,
        clientId: newClient.id,
        projectType: formData.projectType,
        packageName: selectedPackage.name,
        packageId: selectedPackage.id,
        addOns: selectedAddOns,
        date: formData.date,
        location: formData.location,
        progress: 0,
        status: 'Dikonfirmasi',
        bookingStatus: BookingStatus.BARU,
        totalCost: totalProject,
        amountPaid: dpAmount,
        paymentStatus: dpAmount > 0 ? (remainingPayment <= 0 ? PaymentStatus.LUNAS : PaymentStatus.DP_TERBAYAR) : PaymentStatus.BELUM_BAYAR,
        team: [],
        notes: `Referensi Pembayaran DP: ${formData.dpPaymentRef}`,
        promoCodeId: promoCodeAppliedId,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        dpProofUrl: dpProofUrl || undefined
      }, vendorId)

      // Create lead record
      await leadService.createLead({
        name: newClient.name,
        contactChannel: ContactChannel.WEBSITE,
        location: newProject.location,
        status: LeadStatus.CONVERTED,
        date: new Date().toISOString().split('T')[0],
        notes: `Dikonversi dari formulir booking. Klien ID: ${newClient.id}`
      }, vendorId)

      // Create transaction if DP was paid
      if (dpAmount > 0) {
        await transactionService.createTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `DP Proyek ${newProject.projectName}`,
          amount: dpAmount,
          type: TransactionType.INCOME,
          projectId: newProject.id,
          category: 'DP Proyek',
          method: 'Transfer Bank',
          cardId: '',
          pocketId: '',
          printingItemId: '',
          vendorSignature: ''
        }, vendorId)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Terjadi kesalahan saat mengirim booking. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenBookingModal = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsBookingModalOpen(true)
    setIsSubmitted(false)
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      instagram: '',
      projectType: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      selectedAddOnIds: [],
      promoCode: '',
      dp: '',
      dpPaymentRef: ''
    })
    setPaymentProof(null)
    setPromoFeedback({ type: '', message: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-public-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-public-accent mx-auto"></div>
          <p className="mt-4 text-public-text-secondary">Memuat paket layanan...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-public-bg p-4">
        <div className="w-full max-w-lg p-8 text-center bg-public-surface rounded-2xl shadow-lg border border-public-border">
          <h1 className="text-2xl font-bold text-gradient">Terima Kasih!</h1>
          <p className="mt-4 text-public-text-primary">
            Formulir pemesanan Anda telah berhasil kami terima. Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.
          </p>
          <button 
            onClick={() => window.location.href = '#/home'} 
            className="mt-6 button-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-public-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gradient">Vena Pictures</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-public-text-primary mt-4">Paket Layanan Fotografi</h2>
          <p className="text-lg text-public-text-secondary mt-4 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan acara Anda.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className="bg-public-surface rounded-2xl shadow-lg border border-public-border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {pkg.coverImage ? (
                <img src={pkg.coverImage} alt={pkg.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-public-bg flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-gradient">{pkg.name}</h4>
                <p className="text-3xl font-bold text-public-text-primary my-3">{formatCurrency(pkg.price)}</p>
                
                <div className="space-y-4 text-sm flex-grow">
                  {(pkg.photographers || pkg.videographers) && (
                    <div>
                      <h5 className="font-semibold text-public-text-primary mb-1">Tim</h5>
                      <div className="flex items-start gap-2 text-public-text-secondary">
                        <span>✓</span>
                        <span>{[pkg.photographers, pkg.videographers].filter(Boolean).join(' & ')}</span>
                      </div>
                    </div>
                  )}
                  
                  {pkg.physicalItems.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-public-text-primary mb-1">Output Fisik</h5>
                      <div className="space-y-1">
                        {pkg.physicalItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-public-text-secondary">
                            <span>✓</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {pkg.digitalItems.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-public-text-primary mb-1">Output Digital</h5>
                      <div className="space-y-1">
                        {pkg.digitalItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-public-text-secondary">
                            <span>✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-public-border">
                  <button 
                    onClick={() => handleOpenBookingModal(pkg)} 
                    className="button-primary w-full text-center"
                  >
                    Booking Paket Ini
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          title={`Booking: ${selectedPackage?.name}`} 
          size="4xl"
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gradient border-b border-public-border pb-2">
                  Informasi Anda
                </h4>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="clientName" 
                    name="clientName" 
                    value={formData.clientName} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="clientName" className="input-label">Nama Lengkap</label>
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="email" className="input-label">Email</label>
                </div>
                <div className="input-group">
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="phone" className="input-label">Nomor WhatsApp</label>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="projectType" 
                    name="projectType" 
                    value={formData.projectType} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="projectType" className="input-label">Jenis Acara</label>
                </div>
                <div className="input-group">
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="date" className="input-label">Tanggal Acara</label>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                    required 
                  />
                  <label htmlFor="location" className="input-label">Lokasi Acara</label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gradient border-b border-public-border pb-2">
                  Paket & Pembayaran
                </h4>
                
                <div className="input-group">
                  <input 
                    type="text" 
                    id="promoCode" 
                    name="promoCode" 
                    value={formData.promoCode} 
                    onChange={handleFormChange} 
                    className="input-field" 
                    placeholder=" " 
                  />
                  <label htmlFor="promoCode" className="input-label">Kode Promo (Opsional)</label>
                  {promoFeedback.message && (
                    <p className={`text-xs mt-1 ${promoFeedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {promoFeedback.message}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-public-bg rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-public-text-secondary">Paket: {selectedPackage?.name}</span>
                    <span className="text-public-text-primary font-semibold">
                      {formatCurrency(selectedPackage?.price || 0)}
                    </span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-public-text-secondary">Diskon ({discountText})</span>
                      <span className="text-green-500 font-semibold">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-public-border">
                    <span className="text-public-text-secondary">Total Biaya</span>
                    <span className="text-public-text-primary">{formatCurrency(totalProject)}</span>
                  </div>
                  
                  <p className="text-sm text-public-text-secondary">
                    Silakan transfer Uang Muka (DP) ke rekening berikut:
                  </p>
                  <p className="font-semibold text-public-text-primary text-center py-2 bg-public-surface rounded-md border border-public-border">
                    BCA 1234567890 a.n. Vena Pictures
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group !mt-2">
                      <input 
                        type="number" 
                        name="dp" 
                        id="dp" 
                        value={formData.dp} 
                        onChange={handleFormChange} 
                        className="input-field text-right" 
                        placeholder=" " 
                      />
                      <label htmlFor="dp" className="input-label">Jumlah DP</label>
                    </div>
                    <div className="input-group !mt-2">
                      <input 
                        type="text" 
                        name="dpPaymentRef" 
                        id="dpPaymentRef" 
                        value={formData.dpPaymentRef} 
                        onChange={handleFormChange} 
                        className="input-field" 
                        placeholder=" " 
                      />
                      <label htmlFor="dpPaymentRef" className="input-label">No. Ref / 4 Digit Rek</label>
                    </div>
                  </div>
                  
                  <div className="input-group !mt-2">
                    <label htmlFor="dpPaymentProof" className="input-label !static !-top-4 text-public-accent">
                      Unggah Bukti Transfer DP
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-public-border px-6 py-10">
                      <div className="text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-public-text-secondary" />
                        <div className="mt-4 flex text-sm leading-6 text-public-text-secondary">
                          <label 
                            htmlFor="dpPaymentProof" 
                            className="relative cursor-pointer rounded-md bg-public-surface font-semibold text-public-accent hover:text-public-accent-hover"
                          >
                            <span>Unggah file</span>
                            <input 
                              id="dpPaymentProof" 
                              name="dpPaymentProof" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange} 
                              accept="image/png, image/jpeg, image/jpg, application/pdf" 
                            />
                          </label>
                          <p className="pl-1">atau seret dan lepas</p>
                        </div>
                        <p className="text-xs leading-5 text-public-text-secondary">PNG, JPG, PDF hingga 10MB</p>
                      </div>
                    </div>
                    {paymentProof && (
                      <div className="mt-2 text-sm text-public-text-primary bg-public-bg p-2 rounded-md">
                        File terpilih: <span className="font-semibold">{paymentProof.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-public-border">
              <button 
                type="button" 
                onClick={() => setIsBookingModalOpen(false)} 
                className="button-secondary"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="button-primary"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Booking'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default PublicSupabaseBooking