


import React, { useState } from 'react';
import { User } from '../types';
import { GoogleIcon } from '../constants';

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="9" x2="9" y2="9.01"></line><line x1="15" y1="9" x2="15" y2="9.01"></line><line x1="9" y1="15" x2="9" y2="15.01"></line><line x1="15" y1="15" x2="15" y2="15.01"></line>
    </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);


const LockIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

interface SignupFormData {
    fullName: string;
    companyName: string;
    email: string;
    password: string;
}

interface SignupProps {
    onRegister: (formData: SignupFormData) => boolean; // Returns true on success, false on failure (e.g., email exists)
    onSignupSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onRegister, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Kata sandi tidak cocok.');
            return;
        }
        setIsLoading(true);

        // Simulate API call and state update
        setTimeout(() => {
            const success = onRegister({
                fullName: formData.fullName,
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password,
            });

            setIsLoading(false);
            
            if (success) {
                onSignupSuccess();
            } else {
                setError('Email ini sudah terdaftar. Silakan gunakan email lain.');
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-sm mx-auto">
                 <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold" style={{color: '#4f46e5'}}>Daftar Akun</h1>
                        <p className="text-sm text-slate-500 mt-2">Buat akun untuk mulai mengelola bisnis fotografi Anda.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="input-with-icon">
                            <UserIcon className="input-icon w-5 h-5" />
                            <input id="fullName" name="fullName" type="text" required className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="Nama Lengkap Anda" value={formData.fullName} onChange={handleChange}/>
                        </div>
                        <div className="input-with-icon">
                            <BuildingIcon className="input-icon w-5 h-5" />
                            <input id="companyName" name="companyName" type="text" required className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="Nama Usaha Fotografi" value={formData.companyName} onChange={handleChange}/>
                        </div>
                        <div className="input-with-icon">
                            <MailIcon className="input-icon w-5 h-5" />
                            <input id="email" name="email" type="email" required className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="Alamat Email" value={formData.email} onChange={handleChange}/>
                        </div>
                        <div className="input-with-icon">
                            <LockIconSvg className="input-icon w-5 h-5" />
                            <input id="password" name="password" type="password" required className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="Buat Kata Sandi" value={formData.password} onChange={handleChange}/>
                        </div>
                         <div className="input-with-icon">
                            <LockIconSvg className="input-icon w-5 h-5" />
                            <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="Konfirmasi Kata Sandi" value={formData.confirmPassword} onChange={handleChange}/>
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading} className="button-primary w-full">
                                {isLoading ? 'Mendaftar...' : 'Buat Akun'}
                            </button>
                        </div>
                    </form>

                     <div className="flex items-center my-6">
                        <hr className="flex-grow border-t border-slate-200"/>
                        <span className="mx-4 text-xs font-semibold text-slate-400">ATAU</span>
                        <hr className="flex-grow border-t border-slate-200"/>
                    </div>
                     <button className="w-full h-12 px-4 bg-white border border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                        <GoogleIcon className="w-5 h-5" />
                        Daftar dengan Google
                    </button>
                    
                    <div className="text-center mt-6 text-sm text-slate-500">
                        <p>Sudah punya akun? <a href="#/login" className="font-semibold text-blue-600 hover:underline">Masuk di sini</a></p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default Signup;
