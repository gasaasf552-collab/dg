export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          company_name: string
          website: string | null
          address: string | null
          bank_account: string | null
          authorized_signer: string | null
          id_number: string | null
          bio: string | null
          brand_color: string | null
          logo_base64: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone: string
          company_name: string
          website?: string | null
          address?: string | null
          bank_account?: string | null
          authorized_signer?: string | null
          id_number?: string | null
          bio?: string | null
          brand_color?: string | null
          logo_base64?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string
          company_name?: string
          website?: string | null
          address?: string | null
          bank_account?: string | null
          authorized_signer?: string | null
          id_number?: string | null
          bio?: string | null
          brand_color?: string | null
          logo_base64?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          whatsapp: string | null
          instagram: string | null
          client_type: string
          status: string
          since: string
          last_contact: string
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          whatsapp?: string | null
          instagram?: string | null
          client_type: string
          status: string
          since: string
          last_contact: string
          portal_access_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          whatsapp?: string | null
          instagram?: string | null
          client_type?: string
          status?: string
          since?: string
          last_contact?: string
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          user_id: string
          name: string
          price: number
          processing_time: string
          photographers: string | null
          videographers: string | null
          physical_items: Json
          digital_items: Json
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          price: number
          processing_time: string
          photographers?: string | null
          videographers?: string | null
          physical_items?: Json
          digital_items?: Json
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          price?: number
          processing_time?: string
          photographers?: string | null
          videographers?: string | null
          physical_items?: Json
          digital_items?: Json
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      add_ons: {
        Row: {
          id: string
          user_id: string
          name: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          project_name: string
          client_id: string
          client_name: string
          project_type: string
          package_id: string
          package_name: string
          add_ons: Json
          date: string
          deadline_date: string | null
          location: string
          progress: number
          status: string
          active_sub_statuses: Json | null
          total_cost: number
          amount_paid: number
          payment_status: string
          team: Json
          notes: string | null
          accommodation: string | null
          drive_link: string | null
          client_drive_link: string | null
          final_drive_link: string | null
          start_time: string | null
          end_time: string | null
          image: string | null
          revisions: Json | null
          promo_code_id: string | null
          discount_amount: number | null
          shipping_details: string | null
          dp_proof_url: string | null
          printing_details: Json | null
          printing_cost: number | null
          transport_cost: number | null
          booking_status: string | null
          rejection_reason: string | null
          chat_history: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          client_id: string
          client_name: string
          project_type: string
          package_id: string
          package_name: string
          add_ons?: Json
          date: string
          deadline_date?: string | null
          location: string
          progress?: number
          status?: string
          active_sub_statuses?: Json | null
          total_cost: number
          amount_paid?: number
          payment_status?: string
          team?: Json
          notes?: string | null
          accommodation?: string | null
          drive_link?: string | null
          client_drive_link?: string | null
          final_drive_link?: string | null
          start_time?: string | null
          end_time?: string | null
          image?: string | null
          revisions?: Json | null
          promo_code_id?: string | null
          discount_amount?: number | null
          shipping_details?: string | null
          dp_proof_url?: string | null
          printing_details?: Json | null
          printing_cost?: number | null
          transport_cost?: number | null
          booking_status?: string | null
          rejection_reason?: string | null
          chat_history?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          client_id?: string
          client_name?: string
          project_type?: string
          package_id?: string
          package_name?: string
          add_ons?: Json
          date?: string
          deadline_date?: string | null
          location?: string
          progress?: number
          status?: string
          active_sub_statuses?: Json | null
          total_cost?: number
          amount_paid?: number
          payment_status?: string
          team?: Json
          notes?: string | null
          accommodation?: string | null
          drive_link?: string | null
          client_drive_link?: string | null
          final_drive_link?: string | null
          start_time?: string | null
          end_time?: string | null
          image?: string | null
          revisions?: Json | null
          promo_code_id?: string | null
          discount_amount?: number | null
          shipping_details?: string | null
          dp_proof_url?: string | null
          printing_details?: Json | null
          printing_cost?: number | null
          transport_cost?: number | null
          booking_status?: string | null
          rejection_reason?: string | null
          chat_history?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          name: string
          contact_channel: string
          location: string
          status: string
          date: string
          notes: string | null
          whatsapp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          contact_channel: string
          location: string
          status: string
          date: string
          notes?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          contact_channel?: string
          location?: string
          status?: string
          date?: string
          notes?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          description: string
          amount: number
          type: string
          project_id: string | null
          category: string
          method: string
          pocket_id: string | null
          card_id: string | null
          printing_item_id: string | null
          vendor_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          description: string
          amount: number
          type: string
          project_id?: string | null
          category: string
          method: string
          pocket_id?: string | null
          card_id?: string | null
          printing_item_id?: string | null
          vendor_signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          description?: string
          amount?: number
          type?: string
          project_id?: string | null
          category?: string
          method?: string
          pocket_id?: string | null
          card_id?: string | null
          printing_item_id?: string | null
          vendor_signature?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          email: string
          phone: string
          standard_fee: number
          no_rek: string | null
          reward_balance: number
          rating: number
          performance_notes: Json
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          role: string
          email: string
          phone: string
          standard_fee: number
          no_rek?: string | null
          reward_balance?: number
          rating?: number
          performance_notes?: Json
          portal_access_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          role?: string
          email?: string
          phone?: string
          standard_fee?: number
          no_rek?: string | null
          reward_balance?: number
          rating?: number
          performance_notes?: Json
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          user_id: string
          card_holder_name: string
          bank_name: string
          card_type: string
          last_four_digits: string
          expiry_date: string | null
          balance: number
          color_gradient: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_holder_name: string
          bank_name: string
          card_type: string
          last_four_digits: string
          expiry_date?: string | null
          balance?: number
          color_gradient: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_holder_name?: string
          bank_name?: string
          card_type?: string
          last_four_digits?: string
          expiry_date?: string | null
          balance?: number
          color_gradient?: string
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          purchase_date: string
          purchase_price: number
          serial_number: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          purchase_date: string
          purchase_price: number
          serial_number?: string | null
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          purchase_date?: string
          purchase_price?: number
          serial_number?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          user_id: string
          contract_number: string
          client_id: string
          project_id: string
          signing_date: string
          signing_location: string
          client_name1: string
          client_address1: string
          client_phone1: string
          client_name2: string | null
          client_address2: string | null
          client_phone2: string | null
          shooting_duration: string
          guaranteed_photos: string
          album_details: string
          digital_files_format: string
          other_items: string
          personnel_count: string
          delivery_timeframe: string
          dp_date: string
          final_payment_date: string
          cancellation_policy: string
          jurisdiction: string
          vendor_signature: string | null
          client_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contract_number: string
          client_id: string
          project_id: string
          signing_date: string
          signing_location: string
          client_name1: string
          client_address1: string
          client_phone1: string
          client_name2?: string | null
          client_address2?: string | null
          client_phone2?: string | null
          shooting_duration: string
          guaranteed_photos: string
          album_details: string
          digital_files_format?: string
          other_items: string
          personnel_count: string
          delivery_timeframe: string
          dp_date: string
          final_payment_date: string
          cancellation_policy: string
          jurisdiction: string
          vendor_signature?: string | null
          client_signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contract_number?: string
          client_id?: string
          project_id?: string
          signing_date?: string
          signing_location?: string
          client_name1?: string
          client_address1?: string
          client_phone1?: string
          client_name2?: string | null
          client_address2?: string | null
          client_phone2?: string | null
          shooting_duration?: string
          guaranteed_photos?: string
          album_details?: string
          digital_files_format?: string
          other_items?: string
          personnel_count?: string
          delivery_timeframe?: string
          dp_date?: string
          final_payment_date?: string
          cancellation_policy?: string
          jurisdiction?: string
          vendor_signature?: string | null
          client_signature?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_feedback: {
        Row: {
          id: string
          user_id: string
          client_name: string
          rating: number
          satisfaction: string
          feedback: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_name: string
          rating: number
          satisfaction: string
          feedback: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_name?: string
          rating?: number
          satisfaction?: string
          feedback?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          discount_type: string
          discount_value: number
          is_active: boolean
          usage_count: number
          max_usage: number | null
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          discount_type: string
          discount_value: number
          is_active?: boolean
          usage_count?: number
          max_usage?: number | null
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          is_active?: boolean
          usage_count?: number
          max_usage?: number | null
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}