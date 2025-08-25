import React, { useState } from 'react'
import { leadService } from '../lib/supabase-service'
import { LeadStatus, ContactChannel } from '../types'

interface PublicSupabaseLeadFormProps {
  vendorId: string
}

const PublicSupabaseLeadForm: React.FC<PublicSupabaseLeadFormProps> = ({ vendorId }) => {
  const [formState, setFormState] = useState({
    name: '',
    whatsapp: '',
    eventType: '',
    eventDate: '',
    eventLocation: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const notes = `Jenis Acara: ${formState.eventType}\nTanggal Acara: ${new Date(formState.eventDate).toLocaleDateString('id-ID')}\nLokasi Acara: ${formState.eventLocation}`

      await leadService.createLead({
        name: formState.name,
        whatsapp: formState.whatsapp,
        contactChannel: ContactChannel.WEBSITE,
        location: formState.eventLocation,
        status: LeadStatus.DISCUSSION,
        date: new Date().toISOString().split('T')[0],
        notes: notes
      }, vendorId)

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting lead:', error)
      alert('Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-public-bg p-4">
        <div className="w-full max-w-lg p-8 text-center bg-public-surface rounded-2xl shadow-lg border border-public-border">
          <h1 className="text-2xl font-bold text-gradient">Terima Kasih!</h1>
          <p className="mt-4 text-public-text-primary">
            Formulir Anda telah berhasil kami terima. Tim kami akan segera menghubungi Anda melalui WhatsApp untuk diskusi lebih lanjut.
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
    <div className="flex items-center justify-center min-h-screen bg-public-bg p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-public-surface p-8 rounded-2xl shadow-lg border border-public-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient">Formulir Kontak Vena Pictures</h1>
            <p className="text-sm text-public-text-secondary mt-2">
              Isi formulir di bawah ini untuk memulai diskusi mengenai acara Anda.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formState.name} 
                  onChange={handleFormChange} 
                  className="input-field" 
                  placeholder=" " 
                  required 
                />
                <label htmlFor="name" className="input-label">Nama Lengkap</label>
              </div>
              <div className="input-group">
                <input 
                  type="tel" 
                  id="whatsapp" 
                  name="whatsapp" 
                  value={formState.whatsapp} 
                  onChange={handleFormChange} 
                  className="input-field" 
                  placeholder=" " 
                  required 
                />
                <label htmlFor="whatsapp" className="input-label">Nomor WhatsApp</label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="input-group">
                <select 
                  id="eventType" 
                  name="eventType" 
                  value={formState.eventType} 
                  onChange={handleFormChange} 
                  className="input-field" 
                  required
                >
                  <option value="">Pilih jenis acara...</option>
                  <option value="Pernikahan">Pernikahan</option>
                  <option value="Prewedding">Prewedding</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <label htmlFor="eventType" className="input-label">Jenis Acara</label>
              </div>
              <div className="input-group">
                <input 
                  type="date" 
                  id="eventDate" 
                  name="eventDate" 
                  value={formState.eventDate} 
                  onChange={handleFormChange} 
                  className="input-field" 
                  placeholder=" " 
                  required 
                />
                <label htmlFor="eventDate" className="input-label">Tanggal Acara</label>
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  id="eventLocation" 
                  name="eventLocation" 
                  value={formState.eventLocation} 
                  onChange={handleFormChange} 
                  className="input-field" 
                  placeholder=" " 
                  required 
                />
                <label htmlFor="eventLocation" className="input-label">Lokasi (Kota)</label>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full button-primary"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Informasi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PublicSupabaseLeadForm