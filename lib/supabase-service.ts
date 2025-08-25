import { supabase } from './supabase'
import { Database } from './database.types'
import { 
  Client, Project, Package, AddOn, Lead, Transaction, 
  TeamMember, Card, Asset, Contract, ClientFeedback, PromoCode,
  Profile, ClientStatus, LeadStatus, PaymentStatus, TransactionType,
  ContactChannel, ClientType, BookingStatus, AssetStatus, SatisfactionLevel
} from '../types'

type Tables = Database['public']['Tables']

// Helper function to get current user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('User not authenticated')
  return user
}

// Profile Services
export const profileService = {
  async getProfile(): Promise<Profile | null> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No profile found
      throw error
    }

    return {
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      companyName: data.company_name,
      website: data.website || '',
      address: data.address || '',
      bankAccount: data.bank_account || '',
      authorizedSigner: data.authorized_signer || '',
      idNumber: data.id_number || '',
      bio: data.bio || '',
      brandColor: data.brand_color || '#3b82f6',
      logoBase64: data.logo_base64 || '',
      // Default configurations - these would be stored in separate tables in a real app
      incomeCategories: ['DP Proyek', 'Pelunasan', 'Add-On', 'Lainnya'],
      expenseCategories: ['Transportasi', 'Akomodasi', 'Peralatan', 'Operasional', 'Lainnya'],
      projectTypes: ['Pernikahan', 'Prewedding', 'Engagement', 'Birthday', 'Corporate', 'Lainnya'],
      eventTypes: ['Meeting Klien', 'Survey Lokasi', 'Libur', 'Workshop', 'Lainnya'],
      assetCategories: ['Kamera', 'Lensa', 'Lighting', 'Audio', 'Aksesoris', 'Lainnya'],
      sopCategories: ['Fotografi', 'Videografi', 'Editing', 'Administrasi', 'Umum'],
      projectStatusConfig: [
        { id: '1', name: 'Dikonfirmasi', color: '#3b82f6', subStatuses: [], note: '' },
        { id: '2', name: 'Dalam Proses', color: '#8b5cf6', subStatuses: [], note: '' },
        { id: '3', name: 'Selesai', color: '#10b981', subStatuses: [], note: '' }
      ],
      notificationSettings: { newProject: true, paymentConfirmation: true, deadlineReminder: true },
      securitySettings: { twoFactorEnabled: false },
      briefingTemplate: '',
      termsAndConditions: '',
      contractTemplate: '',
      publicPageConfig: {
        template: 'modern',
        title: 'Paket Layanan Fotografi',
        introduction: 'Pilih paket yang sesuai dengan kebutuhan acara Anda.',
        galleryImages: []
      },
      packageShareTemplate: '',
      bookingFormTemplate: '',
      chatTemplates: []
    }
  },

  async createProfile(profileData: Partial<Profile>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: profileData.fullName || '',
        email: profileData.email || user.email || '',
        phone: profileData.phone || '',
        company_name: profileData.companyName || '',
        website: profileData.website,
        address: profileData.address,
        bank_account: profileData.bankAccount,
        authorized_signer: profileData.authorizedSigner,
        id_number: profileData.idNumber,
        bio: profileData.bio,
        brand_color: profileData.brandColor,
        logo_base64: profileData.logoBase64
      })

    if (error) throw error
  },

  async updateProfile(profileData: Partial<Profile>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        company_name: profileData.companyName,
        website: profileData.website,
        address: profileData.address,
        bank_account: profileData.bankAccount,
        authorized_signer: profileData.authorizedSigner,
        id_number: profileData.idNumber,
        bio: profileData.bio,
        brand_color: profileData.brandColor,
        logo_base64: profileData.logoBase64
      })
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// Client Services
export const clientService = {
  async getClients(): Promise<Client[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      whatsapp: client.whatsapp || '',
      instagram: client.instagram || '',
      clientType: client.client_type as ClientType,
      status: client.status as ClientStatus,
      since: client.since,
      lastContact: client.last_contact,
      portalAccessId: client.portal_access_id
    }))
  },

  async createClient(clientData: Omit<Client, 'id'>): Promise<Client> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        whatsapp: clientData.whatsapp,
        instagram: clientData.instagram,
        client_type: clientData.clientType,
        status: clientData.status,
        since: clientData.since,
        last_contact: clientData.lastContact,
        portal_access_id: clientData.portalAccessId
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || '',
      instagram: data.instagram || '',
      clientType: data.client_type as ClientType,
      status: data.status as ClientStatus,
      since: data.since,
      lastContact: data.last_contact,
      portalAccessId: data.portal_access_id
    }
  },

  async updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        whatsapp: clientData.whatsapp,
        instagram: clientData.instagram,
        client_type: clientData.clientType,
        status: clientData.status,
        since: clientData.since,
        last_contact: clientData.lastContact
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async deleteClient(id: string): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// Package Services
export const packageService = {
  async getPackages(): Promise<Package[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      processingTime: pkg.processing_time,
      photographers: pkg.photographers || '',
      videographers: pkg.videographers || '',
      physicalItems: (pkg.physical_items as any) || [],
      digitalItems: (pkg.digital_items as any) || [],
      coverImage: pkg.cover_image || ''
    }))
  },

  async getPublicPackages(userId?: string): Promise<Package[]> {
    let query = supabase.from('packages').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return data.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      processingTime: pkg.processing_time,
      photographers: pkg.photographers || '',
      videographers: pkg.videographers || '',
      physicalItems: (pkg.physical_items as any) || [],
      digitalItems: (pkg.digital_items as any) || [],
      coverImage: pkg.cover_image || ''
    }))
  },

  async createPackage(packageData: Omit<Package, 'id'>): Promise<Package> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('packages')
      .insert({
        user_id: user.id,
        name: packageData.name,
        price: packageData.price,
        processing_time: packageData.processingTime,
        photographers: packageData.photographers,
        videographers: packageData.videographers,
        physical_items: packageData.physicalItems,
        digital_items: packageData.digitalItems,
        cover_image: packageData.coverImage
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      processingTime: data.processing_time,
      photographers: data.photographers || '',
      videographers: data.videographers || '',
      physicalItems: (data.physical_items as any) || [],
      digitalItems: (data.digital_items as any) || [],
      coverImage: data.cover_image || ''
    }
  },

  async updatePackage(id: string, packageData: Partial<Package>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('packages')
      .update({
        name: packageData.name,
        price: packageData.price,
        processing_time: packageData.processingTime,
        photographers: packageData.photographers,
        videographers: packageData.videographers,
        physical_items: packageData.physicalItems,
        digital_items: packageData.digitalItems,
        cover_image: packageData.coverImage
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async deletePackage(id: string): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// Lead Services
export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(lead => ({
      id: lead.id,
      name: lead.name,
      contactChannel: lead.contact_channel as ContactChannel,
      location: lead.location,
      status: lead.status as LeadStatus,
      date: lead.date,
      notes: lead.notes || '',
      whatsapp: lead.whatsapp || ''
    }))
  },

  async createLead(leadData: Omit<Lead, 'id'>, userId?: string): Promise<Lead> {
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getCurrentUser()
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        user_id: targetUserId,
        name: leadData.name,
        contact_channel: leadData.contactChannel,
        location: leadData.location,
        status: leadData.status,
        date: leadData.date,
        notes: leadData.notes,
        whatsapp: leadData.whatsapp
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      contactChannel: data.contact_channel as ContactChannel,
      location: data.location,
      status: data.status as LeadStatus,
      date: data.date,
      notes: data.notes || '',
      whatsapp: data.whatsapp || ''
    }
  },

  async updateLead(id: string, leadData: Partial<Lead>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('leads')
      .update({
        name: leadData.name,
        contact_channel: leadData.contactChannel,
        location: leadData.location,
        status: leadData.status,
        date: leadData.date,
        notes: leadData.notes,
        whatsapp: leadData.whatsapp
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async deleteLead(id: string): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// Project Services
export const projectService = {
  async getProjects(): Promise<Project[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(project => ({
      id: project.id,
      projectName: project.project_name,
      clientId: project.client_id,
      clientName: project.client_name,
      projectType: project.project_type,
      packageId: project.package_id || '',
      packageName: project.package_name,
      addOns: (project.add_ons as any) || [],
      date: project.date,
      deadlineDate: project.deadline_date || '',
      location: project.location,
      progress: project.progress,
      status: project.status,
      activeSubStatuses: (project.active_sub_statuses as any) || [],
      totalCost: project.total_cost,
      amountPaid: project.amount_paid,
      paymentStatus: project.payment_status as PaymentStatus,
      team: (project.team as any) || [],
      notes: project.notes || '',
      accommodation: project.accommodation || '',
      driveLink: project.drive_link || '',
      clientDriveLink: project.client_drive_link || '',
      finalDriveLink: project.final_drive_link || '',
      startTime: project.start_time || '',
      endTime: project.end_time || '',
      image: project.image || '',
      revisions: (project.revisions as any) || [],
      promoCodeId: project.promo_code_id || '',
      discountAmount: project.discount_amount || 0,
      shippingDetails: project.shipping_details || '',
      dpProofUrl: project.dp_proof_url || '',
      printingDetails: (project.printing_details as any) || [],
      printingCost: project.printing_cost || 0,
      transportCost: project.transport_cost || 0,
      bookingStatus: project.booking_status as BookingStatus,
      rejectionReason: project.rejection_reason || '',
      chatHistory: (project.chat_history as any) || []
    }))
  },

  async createProject(projectData: Omit<Project, 'id'>, userId?: string): Promise<Project> {
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getCurrentUser()
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: targetUserId,
        project_name: projectData.projectName,
        client_id: projectData.clientId,
        client_name: projectData.clientName,
        project_type: projectData.projectType,
        package_id: projectData.packageId || null,
        package_name: projectData.packageName,
        add_ons: projectData.addOns,
        date: projectData.date,
        deadline_date: projectData.deadlineDate || null,
        location: projectData.location,
        progress: projectData.progress,
        status: projectData.status,
        active_sub_statuses: projectData.activeSubStatuses,
        total_cost: projectData.totalCost,
        amount_paid: projectData.amountPaid,
        payment_status: projectData.paymentStatus,
        team: projectData.team,
        notes: projectData.notes,
        accommodation: projectData.accommodation,
        drive_link: projectData.driveLink,
        client_drive_link: projectData.clientDriveLink,
        final_drive_link: projectData.finalDriveLink,
        start_time: projectData.startTime,
        end_time: projectData.endTime,
        image: projectData.image,
        revisions: projectData.revisions,
        promo_code_id: projectData.promoCodeId || null,
        discount_amount: projectData.discountAmount,
        shipping_details: projectData.shippingDetails,
        dp_proof_url: projectData.dpProofUrl,
        printing_details: projectData.printingDetails,
        printing_cost: projectData.printingCost,
        transport_cost: projectData.transportCost,
        booking_status: projectData.bookingStatus,
        rejection_reason: projectData.rejectionReason,
        chat_history: projectData.chatHistory
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      projectName: data.project_name,
      clientId: data.client_id,
      clientName: data.client_name,
      projectType: data.project_type,
      packageId: data.package_id || '',
      packageName: data.package_name,
      addOns: (data.add_ons as any) || [],
      date: data.date,
      deadlineDate: data.deadline_date || '',
      location: data.location,
      progress: data.progress,
      status: data.status,
      activeSubStatuses: (data.active_sub_statuses as any) || [],
      totalCost: data.total_cost,
      amountPaid: data.amount_paid,
      paymentStatus: data.payment_status as PaymentStatus,
      team: (data.team as any) || [],
      notes: data.notes || '',
      accommodation: data.accommodation || '',
      driveLink: data.drive_link || '',
      clientDriveLink: data.client_drive_link || '',
      finalDriveLink: data.final_drive_link || '',
      startTime: data.start_time || '',
      endTime: data.end_time || '',
      image: data.image || '',
      revisions: (data.revisions as any) || [],
      promoCodeId: data.promo_code_id || '',
      discountAmount: data.discount_amount || 0,
      shippingDetails: data.shipping_details || '',
      dpProofUrl: data.dp_proof_url || '',
      printingDetails: (data.printing_details as any) || [],
      printingCost: data.printing_cost || 0,
      transportCost: data.transport_cost || 0,
      bookingStatus: data.booking_status as BookingStatus,
      rejectionReason: data.rejection_reason || '',
      chatHistory: (data.chat_history as any) || []
    }
  },

  async updateProject(id: string, projectData: Partial<Project>): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('projects')
      .update({
        project_name: projectData.projectName,
        client_name: projectData.clientName,
        project_type: projectData.projectType,
        package_name: projectData.packageName,
        add_ons: projectData.addOns,
        date: projectData.date,
        deadline_date: projectData.deadlineDate,
        location: projectData.location,
        progress: projectData.progress,
        status: projectData.status,
        active_sub_statuses: projectData.activeSubStatuses,
        total_cost: projectData.totalCost,
        amount_paid: projectData.amountPaid,
        payment_status: projectData.paymentStatus,
        team: projectData.team,
        notes: projectData.notes,
        accommodation: projectData.accommodation,
        drive_link: projectData.driveLink,
        client_drive_link: projectData.clientDriveLink,
        final_drive_link: projectData.finalDriveLink,
        start_time: projectData.startTime,
        end_time: projectData.endTime,
        image: projectData.image,
        revisions: projectData.revisions,
        shipping_details: projectData.shippingDetails,
        dp_proof_url: projectData.dpProofUrl,
        printing_details: projectData.printingDetails,
        printing_cost: projectData.printingCost,
        transport_cost: projectData.transportCost,
        booking_status: projectData.bookingStatus,
        rejection_reason: projectData.rejectionReason,
        chat_history: projectData.chatHistory
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async deleteProject(id: string): Promise<void> {
    const user = await getCurrentUser()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

// Client Feedback Services
export const feedbackService = {
  async createFeedback(feedbackData: Omit<ClientFeedback, 'id'>, userId?: string): Promise<ClientFeedback> {
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getCurrentUser()
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from('client_feedback')
      .insert({
        user_id: targetUserId,
        client_name: feedbackData.clientName,
        rating: feedbackData.rating,
        satisfaction: feedbackData.satisfaction,
        feedback: feedbackData.feedback,
        date: feedbackData.date
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      clientName: data.client_name,
      rating: data.rating,
      satisfaction: data.satisfaction as SatisfactionLevel,
      feedback: data.feedback,
      date: data.date
    }
  },

  async getFeedback(): Promise<ClientFeedback[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('client_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(feedback => ({
      id: feedback.id,
      clientName: feedback.client_name,
      rating: feedback.rating,
      satisfaction: feedback.satisfaction as SatisfactionLevel,
      feedback: feedback.feedback,
      date: feedback.date
    }))
  }
}

// Transaction Services
export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type as TransactionType,
      projectId: transaction.project_id || '',
      category: transaction.category,
      method: transaction.method as any,
      pocketId: transaction.pocket_id || '',
      cardId: transaction.card_id || '',
      printingItemId: transaction.printing_item_id || '',
      vendorSignature: transaction.vendor_signature || ''
    }))
  },

  async createTransaction(transactionData: Omit<Transaction, 'id'>, userId?: string): Promise<Transaction> {
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getCurrentUser()
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: targetUserId,
        date: transactionData.date,
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type,
        project_id: transactionData.projectId || null,
        category: transactionData.category,
        method: transactionData.method,
        pocket_id: transactionData.pocketId || null,
        card_id: transactionData.cardId || null,
        printing_item_id: transactionData.printingItemId || null,
        vendor_signature: transactionData.vendorSignature || null
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type as TransactionType,
      projectId: data.project_id || '',
      category: data.category,
      method: data.method as any,
      pocketId: data.pocket_id || '',
      cardId: data.card_id || '',
      printingItemId: data.printing_item_id || '',
      vendorSignature: data.vendor_signature || ''
    }
  }
}

// Promo Code Services
export const promoCodeService = {
  async getPromoCodes(): Promise<PromoCode[]> {
    const user = await getCurrentUser()
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(promo => ({
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type as 'percentage' | 'fixed',
      discountValue: promo.discount_value,
      isActive: promo.is_active,
      usageCount: promo.usage_count,
      maxUsage: promo.max_usage,
      expiryDate: promo.expiry_date,
      createdAt: promo.created_at
    }))
  },

  async getPublicPromoCodes(userId?: string): Promise<PromoCode[]> {
    let query = supabase
      .from('promo_codes')
      .select('*')
      .eq('is_active', true)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map(promo => ({
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type as 'percentage' | 'fixed',
      discountValue: promo.discount_value,
      isActive: promo.is_active,
      usageCount: promo.usage_count,
      maxUsage: promo.max_usage,
      expiryDate: promo.expiry_date,
      createdAt: promo.created_at
    }))
  },

  async updatePromoCodeUsage(id: string): Promise<void> {
    const { error } = await supabase
      .from('promo_codes')
      .update({
        usage_count: supabase.sql`usage_count + 1`
      })
      .eq('id', id)

    if (error) throw error
  }
}

// Authentication Services
export const authService = {
  async signUp(email: string, password: string, userData: { fullName: string; companyName: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          company_name: userData.companyName
        }
      }
    })

    if (error) throw error

    // Create profile after successful signup
    if (data.user) {
      await profileService.createProfile({
        fullName: userData.fullName,
        email: email,
        companyName: userData.companyName,
        phone: '',
        website: '',
        address: '',
        bankAccount: '',
        authorizedSigner: userData.fullName,
        bio: ''
      })
    }

    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}

// Utility function to get user ID from portal access
export const getUserIdFromPortalAccess = async (portalAccessId: string, type: 'client' | 'freelancer'): Promise<string | null> => {
  if (type === 'client') {
    const { data, error } = await supabase
      .from('clients')
      .select('user_id')
      .eq('portal_access_id', portalAccessId)
      .single()

    if (error || !data) return null
    return data.user_id
  } else {
    const { data, error } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('portal_access_id', portalAccessId)
      .single()

    if (error || !data) return null
    return data.user_id
  }
}