import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { 
  profileService, clientService, packageService, leadService, 
  projectService, feedbackService, transactionService, promoCodeService, authService
} from '../lib/supabase-service'
import { 
  Profile, Client, Package, AddOn, Lead, Project, 
  ClientFeedback, Transaction, PromoCode 
} from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut
  }
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const profileData = await profileService.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [user])

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      await profileService.updateProfile(profileData)
      await loadProfile() // Reload profile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    profile,
    loading,
    updateProfile,
    refetch: loadProfile
  }
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadClients = async () => {
    if (!user) {
      setClients([])
      setLoading(false)
      return
    }

    try {
      const clientsData = await clientService.getClients()
      setClients(clientsData)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [user])

  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const newClient = await clientService.createClient(clientData)
      setClients(prev => [newClient, ...prev])
      return newClient
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      await clientService.updateClient(id, clientData)
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c))
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  const deleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id)
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: loadClients
  }
}

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadPackages = async () => {
    if (!user) {
      setPackages([])
      setLoading(false)
      return
    }

    try {
      const packagesData = await packageService.getPackages()
      setPackages(packagesData)
    } catch (error) {
      console.error('Error loading packages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [user])

  const createPackage = async (packageData: Omit<Package, 'id'>) => {
    try {
      const newPackage = await packageService.createPackage(packageData)
      setPackages(prev => [...prev, newPackage])
      return newPackage
    } catch (error) {
      console.error('Error creating package:', error)
      throw error
    }
  }

  const updatePackage = async (id: string, packageData: Partial<Package>) => {
    try {
      await packageService.updatePackage(id, packageData)
      setPackages(prev => prev.map(p => p.id === id ? { ...p, ...packageData } : p))
    } catch (error) {
      console.error('Error updating package:', error)
      throw error
    }
  }

  const deletePackage = async (id: string) => {
    try {
      await packageService.deletePackage(id)
      setPackages(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting package:', error)
      throw error
    }
  }

  return {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    refetch: loadPackages
  }
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadLeads = async () => {
    if (!user) {
      setLeads([])
      setLoading(false)
      return
    }

    try {
      const leadsData = await leadService.getLeads()
      setLeads(leadsData)
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [user])

  const createLead = async (leadData: Omit<Lead, 'id'>) => {
    try {
      const newLead = await leadService.createLead(leadData)
      setLeads(prev => [newLead, ...prev])
      return newLead
    } catch (error) {
      console.error('Error creating lead:', error)
      throw error
    }
  }

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      await leadService.updateLead(id, leadData)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...leadData } : l))
    } catch (error) {
      console.error('Error updating lead:', error)
      throw error
    }
  }

  const deleteLead = async (id: string) => {
    try {
      await leadService.deleteLead(id)
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch (error) {
      console.error('Error deleting lead:', error)
      throw error
    }
  }

  return {
    leads,
    loading,
    createLead,
    updateLead,
    deleteLead,
    refetch: loadLeads
  }
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadProjects = async () => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    try {
      const projectsData = await projectService.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [user])

  const createProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await projectService.createProject(projectData)
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      await projectService.updateProject(id, projectData)
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p))
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects
  }
}

// Add-Ons Hook
export const useAddOns = () => {
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadAddOns = async () => {
        if (!user) {
            setAddOns([]);
            setLoading(false);
            return;
        }
        try {
            const data = await addOnService.getAddOns();
            setAddOns(data);
        } catch (error) {
            console.error('Error loading add-ons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddOns();
    }, [user]);

    const createAddOn = async (addOnData: Omit<AddOn, 'id'>) => {
        const newAddOn = await addOnService.createAddOn(addOnData);
        setAddOns(prev => [...prev, newAddOn]);
        return newAddOn;
    };

    const updateAddOn = async (id: string, addOnData: Partial<AddOn>) => {
        await addOnService.updateAddOn(id, addOnData);
        setAddOns(prev => prev.map(a => a.id === id ? { ...a, ...addOnData } : a));
    };

    const deleteAddOn = async (id: string) => {
        await addOnService.deleteAddOn(id);
        setAddOns(prev => prev.filter(a => a.id !== id));
    };

    return { addOns, loading, createAddOn, updateAddOn, deleteAddOn, refetch: loadAddOns };
};

// Transactions Hook
export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadTransactions = async () => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }
        try {
            const data = await transactionService.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [user]);

    const createTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
        const newTransaction = await transactionService.createTransaction(transactionData);
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return newTransaction;
    };

    const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
        await transactionService.updateTransaction(id, transactionData);
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transactionData } : t));
    };

    const deleteTransaction = async (id: string) => {
        await transactionService.deleteTransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return { transactions, loading, createTransaction, updateTransaction, deleteTransaction, refetch: loadTransactions };
};

// PromoCodes Hook
export const usePromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadPromoCodes = async () => {
        if (!user) {
            setPromoCodes([]);
            setLoading(false);
            return;
        }
        try {
            const data = await promoCodeService.getPromoCodes();
            setPromoCodes(data);
        } catch (error) {
            console.error('Error loading promo codes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromoCodes();
    }, [user]);

    const createPromoCode = async (promoCodeData: Omit<PromoCode, 'id' | 'usageCount' | 'createdAt'>) => {
        const newPromoCode = await promoCodeService.createPromoCode(promoCodeData);
        setPromoCodes(prev => [...prev, newPromoCode]);
        return newPromoCode;
    };

    const updatePromoCode = async (id: string, promoCodeData: Partial<PromoCode>) => {
        await promoCodeService.updatePromoCode(id, promoCodeData);
        setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, ...promoCodeData } : p));
    };

    const deletePromoCode = async (id: string) => {
        await promoCodeService.deletePromoCode(id);
        setPromoCodes(prev => prev.filter(p => p.id !== id));
    };

    return { promoCodes, loading, createPromoCode, updatePromoCode, deletePromoCode, refetch: loadPromoCodes };
};

// Team Members Hook
export const useTeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadTeamMembers = async () => {
        if (!user) {
            setTeamMembers([]);
            setLoading(false);
            return;
        }
        try {
            const data = await teamMemberService.getTeamMembers();
            setTeamMembers(data);
        } catch (error) {
            console.error('Error loading team members:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeamMembers();
    }, [user]);

    const createTeamMember = async (teamMemberData: Omit<TeamMember, 'id'>) => {
        const newTeamMember = await teamMemberService.createTeamMember(teamMemberData);
        setTeamMembers(prev => [...prev, newTeamMember]);
        return newTeamMember;
    };

    const updateTeamMember = async (id: string, teamMemberData: Partial<TeamMember>) => {
        await teamMemberService.updateTeamMember(id, teamMemberData);
        setTeamMembers(prev => prev.map(tm => tm.id === id ? { ...tm, ...teamMemberData } : tm));
    };

    const deleteTeamMember = async (id: string) => {
        await teamMemberService.deleteTeamMember(id);
        setTeamMembers(prev => prev.filter(tm => tm.id !== id));
    };

    return { teamMembers, loading, createTeamMember, updateTeamMember, deleteTeamMember, refetch: loadTeamMembers };
};

// Contracts Hook
export const useContracts = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadContracts = async () => {
        if (!user) {
            setContracts([]);
            setLoading(false);
            return;
        }
        try {
            const data = await contractService.getContracts();
            setContracts(data);
        } catch (error) {
            console.error('Error loading contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContracts();
    }, [user]);

    const createContract = async (contractData: Omit<Contract, 'id'>) => {
        const newContract = await contractService.createContract(contractData);
        setContracts(prev => [...prev, newContract]);
        return newContract;
    };

    const updateContract = async (id: string, contractData: Partial<Contract>) => {
        await contractService.updateContract(id, contractData);
        setContracts(prev => prev.map(c => c.id === id ? { ...c, ...contractData } : c));
    };

    const deleteContract = async (id: string) => {
        await contractService.deleteContract(id);
        setContracts(prev => prev.filter(c => c.id !== id));
    };

    return { contracts, loading, createContract, updateContract, deleteContract, refetch: loadContracts };
};

// Assets Hook
export const useAssets = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadAssets = async () => {
        if (!user) {
            setAssets([]);
            setLoading(false);
            return;
        }
        try {
            const data = await assetService.getAssets();
            setAssets(data);
        } catch (error) {
            console.error('Error loading assets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, [user]);

    const createAsset = async (assetData: Omit<Asset, 'id'>) => {
        const newAsset = await assetService.createAsset(assetData);
        setAssets(prev => [...prev, newAsset]);
        return newAsset;
    };

    const updateAsset = async (id: string, assetData: Partial<Asset>) => {
        await assetService.updateAsset(id, assetData);
        setAssets(prev => prev.map(a => a.id === id ? { ...a, ...assetData } : a));
    };

    const deleteAsset = async (id: string) => {
        await assetService.deleteAsset(id);
        setAssets(prev => prev.filter(a => a.id !== id));
    };

    return { assets, loading, createAsset, updateAsset, deleteAsset, refetch: loadAssets };
};

// SOPs Hook
export const useSops = () => {
    const [sops, setSops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadSops = async () => {
        if (!user) {
            setSops([]);
            setLoading(false);
            return;
        }
        try {
            const data = await sopService.getSops();
            setSops(data);
        } catch (error) {
            console.error('Error loading sops:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSops();
    }, [user]);

    const createSop = async (sopData: any) => {
        const newSop = await sopService.createSop(sopData);
        setSops(prev => [...prev, newSop]);
        return newSop;
    };

    const updateSop = async (id: string, sopData: any) => {
        await sopService.updateSop(id, sopData);
        setSops(prev => prev.map(s => s.id === id ? { ...s, ...sopData } : s));
    };

    const deleteSop = async (id: string) => {
        await sopService.deleteSop(id);
        setSops(prev => prev.filter(s => s.id !== id));
    };

    return { sops, loading, createSop, updateSop, deleteSop, refetch: loadSops };
};