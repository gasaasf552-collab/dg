

import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, ContactChannel, Profile, PublicLeadFormProps } from '../types';
import { cleanPhoneNumber } from '../constants';

const PublicLeadForm: React.FC<PublicLeadFormProps> = ({ setLeads, userProfile, showNotification }) => {
    const [formState, setFormState] = useState({
        name: '',
        whatsapp: '',
        eventType: userProfile.projectTypes[0] || '',
        eventDate: '',
        eventLocation: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const template = userProfile.publicPageConfig.template || 'classic';

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const notes = `Jenis Acara: ${formState.eventType}\nTanggal Acara: ${new Date(formState.eventDate).toLocaleDateString('id-ID')}\nLokasi Acara: ${formState.eventLocation}`;

        const newLead: Lead = {
            id: `LEAD-FORM-${Date.now()}`,
            name: formState.name,
            whatsapp: formState.whatsapp,
            contactChannel: ContactChannel.WEBSITE,
            location: formState.eventLocation,
            status: LeadStatus.DISCUSSION,
            date: new Date().toISOString(),
            notes: notes
        };

        // Simulate API call
        setTimeout(() => {
            setLeads(prev => [newLead, ...prev]);
            setIsSubmitting(false);
            setIsSubmitted(true);
            // This notification won't be visible on the public page, but it's good practice
            showNotification('Prospek baru diterima dari formulir web.');
        }, 1000);
    };

    if (isSubmitted) {
        return (
            <div className={`template-wrapper template-${template} flex items-center justify-center min-h-screen p-4`}>
                <div className="w-full max-w-lg p-8 text-center bg-public-surface rounded-2xl shadow-lg border border-public-border">
                    <h1 className="text-2xl font-bold text-gradient">Terima Kasih!</h1>
                    <p className="mt-4 text-public-text-primary">
                        Formulir Anda telah berhasil kami terima. Tim kami akan segera menghubungi Anda melalui WhatsApp untuk diskusi lebih lanjut.
                    </p>
                    <a
                        href={`https://wa.me/${cleanPhoneNumber(userProfile.phone)}?text=Halo%20${encodeURIComponent(userProfile.companyName)}%2C%20saya%20sudah%20mengisi%20formulir%20prospek.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 button-primary inline-block"
                    >
                        Konfirmasi via WhatsApp
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`template-wrapper template-${template} flex items-center justify-center min-h-screen p-4`}>
             <style>{`
                .template-wrapper { background-color: var(--public-bg); color: var(--public-text-primary); }
                .template-classic .form-container { max-width: 42rem; width: 100%; margin: auto; }
                .template-modern .form-container { max-width: 56rem; width: 100%; margin: auto; display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: center; }
                .template-gallery .form-container { max-width: 36rem; width: 100%; margin: auto; font-family: serif; }
                @media (max-width: 768px) { .template-modern .form-container { grid-template-columns: 1fr; } }
            `}</style>
            <div className="form-container">
                {template === 'modern' && (
                    <div className="p-8 hidden md:block">
                        {userProfile.logoBase64 ? <img src={userProfile.logoBase64} alt="logo" className="h-12 mb-4" /> : <h2 className="text-2xl font-bold text-gradient">{userProfile.companyName}</h2>}
                        <p className="text-public-text-secondary text-sm mt-4">{userProfile.bio}</p>
                    </div>
                )}
                <div className="bg-public-surface p-8 rounded-2xl shadow-lg border border-public-border">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gradient">Formulir Kontak {userProfile.companyName}</h1>
                        <p className="text-sm text-public-text-secondary mt-2">Isi formulir di bawah ini untuk memulai diskusi mengenai acara Anda.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <input type="text" id="name" name="name" value={formState.name} onChange={handleFormChange} className="input-field" placeholder=" " required />
                                <label htmlFor="name" className="input-label">Nama Lengkap</label>
                            </div>
                            <div className="input-group">
                                <input type="tel" id="whatsapp" name="whatsapp" value={formState.whatsapp} onChange={handleFormChange} className="input-field" placeholder=" " required />
                                <label htmlFor="whatsapp" className="input-label">Nomor WhatsApp</label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="input-group">
                                <select id="eventType" name="eventType" value={formState.eventType} onChange={handleFormChange} className="input-field" required>
                                    {userProfile.projectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                </select>
                                <label htmlFor="eventType" className="input-label">Jenis Acara</label>
                            </div>
                            <div className="input-group">
                                <input type="date" id="eventDate" name="eventDate" value={formState.eventDate} onChange={handleFormChange} className="input-field" placeholder=" " required />
                                <label htmlFor="eventDate" className="input-label">Tanggal Acara</label>
                            </div>
                             <div className="input-group">
                                <input type="text" id="eventLocation" name="eventLocation" value={formState.eventLocation} onChange={handleFormChange} className="input-field" placeholder=" " required />
                                <label htmlFor="eventLocation" className="input-label">Lokasi (Kota)</label>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={isSubmitting} className="w-full button-primary">
                                {isSubmitting ? 'Mengirim...' : 'Kirim Informasi'}
                            </button>
                            <a
                                href={`https://wa.me/${cleanPhoneNumber(userProfile.phone)}?text=Halo%20${encodeURIComponent(userProfile.companyName)}%2C%20saya%20tertarik%20dengan%20layanan%20Anda.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block mt-3 button-secondary text-center"
                            >
                                Atau Hubungi via WhatsApp
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublicLeadForm;