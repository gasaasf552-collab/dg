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