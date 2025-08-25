
import React, { useState, useMemo, useEffect } from 'react';
import { Package, AddOn, Project, PhysicalItem } from '../types';
import PageHeader from './PageHeader';
import Modal from './Modal';
import { PencilIcon, Trash2Icon, PlusIcon, Share2Icon, FileTextIcon, CameraIcon } from '../constants';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const emptyPackageForm = {
    name: '',
    price: '',
    processingTime: '',
    photographers: '',
    videographers: '',
    physicalItems: [{ name: '', price: '' }],
    digitalItems: [''],
    coverImage: '',
};
const emptyAddOnForm = { name: '', price: '' };

interface PackagesProps {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    projects: Project[];
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


const Packages: React.FC<PackagesProps> = ({ packages, setPackages, addOns, setAddOns, projects }) => {
  const [packageFormData, setPackageFormData] = useState(emptyPackageForm);
  const [packageEditMode, setPackageEditMode] = useState<string | null>(null);

  const [addOnFormData, setAddOnFormData] = useState(emptyAddOnForm);
  const [addOnEditMode, setAddOnEditMode] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const publicPackagesUrl = useMemo(() => {
    // A more robust solution would involve getting the vendor's unique ID
    const vendorId = 'VEN001'; // Placeholder for the default vendor
    return `${window.location.origin}${window.location.pathname}#/public-packages/${vendorId}`;
  }, []);

  const copyPackagesLinkToClipboard = () => {
      navigator.clipboard.writeText(publicPackagesUrl).then(() => {
          alert('Tautan halaman paket berhasil disalin!');
      });
  };


  // --- Package Handlers ---
  const handlePackageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPackageFormData(prev => ({...prev, [name]: value}));
  };
  
   const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>, packageId: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await toBase64(file);
            setPackages(prev => prev.map(p => p.id === packageId ? { ...p, coverImage: base64 } : p));
        }
    };

  const handlePhysicalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...packageFormData.physicalItems];
    list[index] = { ...list[index], [name]: value };
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };

  const addPhysicalItem = () => {
    setPackageFormData(prev => ({ ...prev, physicalItems: [...prev.physicalItems, { name: '', price: '' }] }));
  };

  const removePhysicalItem = (index: number) => {
    const list = [...packageFormData.physicalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, physicalItems: list }));
  };
  
  const handleDigitalItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const list = [...packageFormData.digitalItems];
    list[index] = value;
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };

  const addDigitalItem = () => {
    setPackageFormData(prev => ({ ...prev, digitalItems: [...prev.digitalItems, ''] }));
  };

  const removeDigitalItem = (index: number) => {
    const list = [...packageFormData.digitalItems];
    list.splice(index, 1);
    setPackageFormData(prev => ({ ...prev, digitalItems: list }));
  };


  const handlePackageCancelEdit = () => {
    setPackageEditMode(null);
    setPackageFormData(emptyPackageForm);
  }

  const handlePackageEdit = (pkg: Package) => {
    setPackageEditMode(pkg.id);
    setPackageFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        processingTime: pkg.processingTime,
        photographers: pkg.photographers || '',
        videographers: pkg.videographers || '',
        physicalItems: pkg.physicalItems.length > 0 ? pkg.physicalItems.map(item => ({...item, price: item.price.toString()})) : [{ name: '', price: '' }],
        digitalItems: pkg.digitalItems.length > 0 ? pkg.digitalItems : [''],
        coverImage: pkg.coverImage || '',
    });
  }

  const handlePackageDelete = (pkgId: string) => {
    const isPackageInUse = projects.some(p => p.packageId === pkgId);
    if (isPackageInUse) {
        alert("Paket ini tidak dapat dihapus karena sedang digunakan oleh satu atau lebih proyek. Hapus atau ubah proyek tersebut terlebih dahulu.");
        return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
        setPackages(prev => prev.filter(p => p.id !== pkgId));
    }
  }

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageFormData.name || !packageFormData.price) {
        alert('Nama Paket dan Harga tidak boleh kosong.');
        return;
    }

    const packageData: Omit<Package, 'id'> = {
        name: packageFormData.name,
        price: Number(packageFormData.price),
        processingTime: packageFormData.processingTime,
        photographers: packageFormData.photographers,
        videographers: packageFormData.videographers,
        physicalItems: packageFormData.physicalItems
            .filter(item => item.name.trim() !== '')
            .map(item => ({ ...item, price: Number(item.price || 0) })),
        digitalItems: packageFormData.digitalItems.filter(item => item.trim() !== ''),
        coverImage: packageFormData.coverImage,
    };
    
    if (packageEditMode) {
        setPackages(prev => prev.map(p => p.id === packageEditMode ? { ...p, ...packageData } : p));
    } else {
        const newPackage: Package = { ...packageData, id: `PKG${Date.now()}` };
        setPackages(prev => [...prev, newPackage]);
    }

    handlePackageCancelEdit();
  };

  // --- AddOn Handlers ---
  const handleAddOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddOnFormData(prev => ({...prev, [name]: value}));
  };

  const handleAddOnCancelEdit = () => {
    setAddOnEditMode(null);
    setAddOnFormData(emptyAddOnForm);
  }

  const handleAddOnEdit = (addOn: AddOn) => {
    setAddOnEditMode(addOn.id);
    setAddOnFormData({
        name: addOn.name,
        price: addOn.price.toString(),
    });
  }

  const handleAddOnDelete = (addOnId: string) => {
    const isAddOnInUse = projects.some(p => p.addOns.some(a => a.id === addOnId));
    if (isAddOnInUse) {
        alert("Add-on ini tidak dapat dihapus karena sedang digunakan oleh satu atau lebih proyek. Hapus atau ubah proyek tersebut terlebih dahulu.");
        return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus add-on ini?")) {
        setAddOns(prev => prev.filter(a => a.id !== addOnId));
    }
  }

  const handleAddOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOnFormData.name || !addOnFormData.price) {
        alert('Nama Add-On dan Harga tidak boleh kosong.');
        return;
    }

    const addOnData: Omit<AddOn, 'id'> = {
        name: addOnFormData.name,
        price: Number(addOnFormData.price),
    };
    
    if (addOnEditMode) {
        setAddOns(prev => prev.map(a => a.id === addOnEditMode ? { ...a, ...addOnData } : a));
    } else {
        const newAddOn: AddOn = { ...addOnData, id: `ADD${Date.now()}` };
        setAddOns(prev => [...prev, newAddOn]);
    }

    handleAddOnCancelEdit();
  };


  return (
    <div>
      <PageHeader title="Manajemen Paket & Add-On" subtitle="Kelola paket layanan dan item tambahan untuk klien Anda.">
          <div className="flex items-center gap-2">
              <button onClick={() => setIsInfoModalOpen(true)} className="button-secondary">Pelajari Halaman Ini</button>
              <button onClick={() => setIsShareModalOpen(true)} className="button-secondary inline-flex items-center gap-2">
                  <Share2Icon className="w-4 h-4"/> Bagikan Halaman Paket
              </button>
               <a href="#/public-booking" target="_blank" rel="noopener noreferrer" className="button-primary inline-flex items-center gap-2">
                 <FileTextIcon className="w-4 h-4" /> Form Booking
              </a>
          </div>
      </PageHeader>
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* === Left Column: PACKAGES FORM === */}
        <div className="lg:col-span-2 bg-brand-surface p-6 rounded-2xl space-y-6 lg:sticky lg:top-8">
            <h3 className="text-xl font-semibold text-brand-text-light border-b border-gray-700/50 pb-4">{packageEditMode ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
            <form className="space-y-4" onSubmit={handlePackageSubmit}>
                <div className="input-group"><input type="text" name="name" value={packageFormData.name} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Nama Paket</label></div>
                <div className="input-group"><input type="number" name="price" value={packageFormData.price} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Harga Paket (IDR)</label></div>
                <div className="input-group"><input type="text" name="processingTime" value={packageFormData.processingTime} onChange={handlePackageInputChange} className="input-field" placeholder=" " required/><label className="input-label">Estimasi Pengerjaan</label></div>
                <div className="input-group"><input type="text" name="photographers" value={packageFormData.photographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Fotografer (e.g., 2 Fotografer)</label></div>
                <div className="input-group"><input type="text" name="videographers" value={packageFormData.videographers} onChange={handlePackageInputChange} className="input-field" placeholder=" "/><label className="input-label">Videografer (e.g., 1 Videografer)</label></div>
                
                {/* Physical Items */}
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Fisik</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.physicalItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" name="name" value={item.name} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Nama Item" className="input-field !p-2 !text-sm flex-grow" />
                                <input type="number" name="price" value={item.price} onChange={(e) => handlePhysicalItemChange(index, e)} placeholder="Harga" className="input-field !p-2 !text-sm w-28" />
                                <button type="button" onClick={() => removePhysicalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addPhysicalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item</button>
                    </div>
                </div>

                {/* Digital Items */}
                <div>
                    <label className="text-sm font-medium text-brand-text-secondary">Output Digital</label>
                    <div className="space-y-2 mt-2">
                        {packageFormData.digitalItems.map((item, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <input type="text" value={item} onChange={(e) => handleDigitalItemChange(index, e)} placeholder="Deskripsi Item" className="input-field !p-2 !text-sm flex-grow" />
                                <button type="button" onClick={() => removeDigitalItem(index)} className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addDigitalItem} className="text-sm font-semibold text-brand-accent hover:underline">+ Tambah Item</button>
                    </div>
                </div>

                <div className="text-right space-x-2 pt-2">
                    {packageEditMode && (<button type="button" onClick={handlePackageCancelEdit} className="button-secondary">Batal</button>)}
                    <button type="submit" className="button-primary">{packageEditMode ? 'Update Paket' : 'Simpan Paket'}</button>
                </div>
            </form>
        </div>

        {/* === Right Column: PACKAGES LIST & ADDONS === */}
        <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-brand-text-light">Daftar Paket</h3>
                {packages.map(pkg => (
                    <div key={pkg.id} className="p-4 bg-brand-surface rounded-xl shadow-lg border border-brand-border">
                        <div className="flex justify-between items-start">
                             <div className="flex items-start gap-4">
                                {pkg.coverImage ? (
                                    <img src={pkg.coverImage} alt={pkg.name} className="w-20 h-20 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-20 h-20 bg-brand-bg rounded-lg flex items-center justify-center">
                                        <CameraIcon className="w-8 h-8 text-brand-text-secondary" />
                                    </div>
                                )}
                                <div>
                                    <h5 className="font-bold text-brand-text-light">{pkg.name}</h5>
                                    <p className="text-sm text-brand-text-secondary mt-1">Estimasi Pengerjaan: {pkg.processingTime}</p>
                                </div>
                            </div>
                            <div className="text-right ml-4 flex-shrink-0">
                                <p className="text-lg font-semibold text-brand-text-light whitespace-nowrap">{formatCurrency(pkg.price)}</p>
                                <div className="flex items-center justify-end space-x-2 mt-2">
                                     <label htmlFor={`cover-upload-${pkg.id}`} className="p-1 text-brand-text-secondary hover:text-brand-accent cursor-pointer" title="Unggah Gambar">
                                        <CameraIcon className="w-4 h-4"/>
                                        <input type="file" id={`cover-upload-${pkg.id}`} className="hidden" accept="image/*" onChange={(e) => handleCoverImageChange(e, pkg.id)} />
                                    </label>
                                    <button type="button" onClick={() => handlePackageEdit(pkg)} className="p-1 text-brand-text-secondary hover:text-brand-accent" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => handlePackageDelete(pkg.id)} className="p-1 text-brand-text-secondary hover:text-brand-danger" title="Hapus"><Trash2Icon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-brand-border/50">
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Tim yang Termasuk</h6>
                                <ul className="space-y-1 text-xs text-brand-text-secondary">
                                    {pkg.photographers && <li>• {pkg.photographers}</li>}
                                    {pkg.videographers && <li>• {pkg.videographers}</li>}
                                    {(!pkg.photographers && !pkg.videographers) && <p className="italic">Tidak ada detail tim.</p>}
                                </ul>
                            </div>
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Output Fisik</h6>
                                {pkg.physicalItems.length > 0 ? (
                                    <ul className="space-y-1 text-xs text-brand-text-secondary">
                                        {pkg.physicalItems.map((item, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>• {item.name}</span>
                                                <span className="font-medium text-brand-text-primary/80">{formatCurrency(item.price)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-xs text-brand-text-secondary italic">Tidak ada.</p>}
                            </div>
                            <div>
                                <h6 className="font-semibold text-sm text-brand-text-primary mb-2">Output Digital</h6>
                                {pkg.digitalItems.length > 0 ? (
                                    <ul className="space-y-1 text-xs list-disc list-inside text-brand-text-secondary">
                                        {pkg.digitalItems.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                 ) : <p className="text-xs text-brand-text-secondary italic">Tidak ada.</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-brand-surface p-6 rounded-2xl space-y-6">
                <h3 className="text-xl font-semibold text-brand-text-light border-b border-gray-700/50 pb-4">Add-On Tambahan</h3>
                <div className="p-4 bg-brand-bg rounded-xl">
                    <h4 className="text-lg font-semibold text-brand-text-light mb-4">{addOnEditMode ? 'Edit Add-On' : 'Tambah Add-On Baru'}</h4>
                    <form className="space-y-4" onSubmit={handleAddOnSubmit}>
                        <div className="input-group"><input type="text" name="name" value={addOnFormData.name} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required/><label className="input-label">Nama Add-On</label></div>
                        <div className="input-group"><input type="number" name="price" value={addOnFormData.price} onChange={handleAddOnInputChange} className="input-field" placeholder=" " required/><label className="input-label">Harga (IDR)</label></div>
                        <div className="text-right space-x-2 pt-2">
                            {addOnEditMode && (<button type="button" onClick={handleAddOnCancelEdit} className="button-secondary">Batal</button>)}
                            <button type="submit" className="button-primary">{addOnEditMode ? 'Update Add-On' : 'Simpan Add-On'}</button>
                        </div>
                    </form>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-700/50">
                    {addOns.map(addOn => (<div key={addOn.id} className="p-3 bg-brand-bg rounded-xl flex justify-between items-center">
                        <p className="font-medium text-brand-text-light">{addOn.name}</p>
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-brand-text-primary">{formatCurrency(addOn.price)}</p>
                            <div className="flex items-center space-x-2">
                                <button type="button" onClick={() => handleAddOnEdit(addOn)} className="p-1 text-brand-text-secondary hover:text-brand-accent" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                <button type="button" onClick={() => handleAddOnDelete(addOn.id)} className="p-1 text-brand-text-secondary hover:text-brand-danger" title="Hapus"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>

      </div>
        <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Bagikan Halaman Paket Layanan" size="md">
            <div className="p-4">
                <p className="text-sm text-brand-text-secondary mb-2">Bagikan tautan halaman paket berikut:</p>
                <div className="flex items-center gap-2">
                    <input type="text" readOnly value={publicPackagesUrl} className="input-field !bg-brand-input w-full" />
                    <button onClick={copyPackagesLinkToClipboard} className="button-secondary">Salin</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title="Panduan Halaman Paket">
            <div className="space-y-4 text-sm text-brand-text-primary">
                <p>Halaman ini adalah tempat Anda mendefinisikan semua layanan yang Anda tawarkan.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Tambah Paket:</strong> Gunakan formulir di sebelah kiri untuk membuat paket baru. Isi detail seperti nama, harga, dan item yang termasuk (digital dan fisik).</li>
                    <li><strong>Kelola Paket:</strong> Di daftar sebelah kanan, Anda dapat mengedit atau menghapus paket yang ada. Anda juga bisa mengunggah gambar sampul untuk setiap paket.</li>
                    <li><strong>Add-On:</strong> Di bagian bawah, kelola item tambahan yang bisa dipilih klien di luar paket utama, seperti drone atau album tambahan.</li>
                    <li><strong>Bagikan Halaman:</strong> Gunakan tombol "Bagikan Halaman Paket" untuk mendapatkan tautan ke halaman publik yang menampilkan semua paket Anda, memudahkan calon klien untuk melihat penawaran Anda.</li>
                </ul>
            </div>
        </Modal>
    </div>
  );
};

export default Packages;
