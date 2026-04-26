export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          ends_at: string
          goal_unit: string | null
          goal_value: number | null
          id: string
          started_at: string
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          ends_at: string
          goal_unit?: string | null
          goal_value?: number | null
          id?: string
          started_at: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          ends_at?: string
          goal_unit?: string | null
          goal_value?: number | null
          id?: string
          started_at?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_meals: {
        Row: {
          created_at: string | null
          day_of_week: string
          diet_plan_id: string
          id: string
          meal_name: string
          meal_type: string
          notes: string | null
          order_in_day: number
          scheduled_time: string | null
          total_calories: number
          total_carbs_g: number
          total_fat_g: number
          total_protein_g: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: string
          diet_plan_id: string
          id?: string
          meal_name: string
          meal_type: string
          notes?: string | null
          order_in_day: number
          scheduled_time?: string | null
          total_calories?: number
          total_carbs_g?: number
          total_fat_g?: number
          total_protein_g?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: string
          diet_plan_id?: string
          id?: string
          meal_name?: string
          meal_type?: string
          notes?: string | null
          order_in_day?: number
          scheduled_time?: string | null
          total_calories?: number
          total_carbs_g?: number
          total_fat_g?: number
          total_protein_g?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["active_diet_plan_id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          ai_prompt_used: string | null
          cooking_habit: string | null
          created_at: string | null
          generated_by_ai: boolean | null
          goal: string
          hunger_pattern: string | null
          id: string
          is_active: boolean | null
          meals_per_day: number
          name: string
          pdf_url: string | null
          target_calories: number
          target_carbs_g: number
          target_fat_g: number
          target_protein_g: number
          updated_at: string | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
          water_target_ml: number | null
        }
        Insert: {
          ai_prompt_used?: string | null
          cooking_habit?: string | null
          created_at?: string | null
          generated_by_ai?: boolean | null
          goal: string
          hunger_pattern?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_day: number
          name?: string
          pdf_url?: string | null
          target_calories: number
          target_carbs_g: number
          target_fat_g: number
          target_protein_g: number
          updated_at?: string | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
          water_target_ml?: number | null
        }
        Update: {
          ai_prompt_used?: string | null
          cooking_habit?: string | null
          created_at?: string | null
          generated_by_ai?: boolean | null
          goal?: string
          hunger_pattern?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_day?: number
          name?: string
          pdf_url?: string | null
          target_calories?: number
          target_carbs_g?: number
          target_fat_g?: number
          target_protein_g?: number
          updated_at?: string | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
          water_target_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      dietary_restriction_types: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          difficulty: string
          equipment: string | null
          id: string
          image_url: string | null
          instructions: string | null
          is_active: boolean | null
          location: string
          muscle_group_id: string
          name: string
          secondary_muscle_ids: string[] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: string
          equipment?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_active?: boolean | null
          location: string
          muscle_group_id: string
          name: string
          secondary_muscle_ids?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: string
          equipment?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_active?: boolean | null
          location?: string
          muscle_group_id?: string
          name?: string
          secondary_muscle_ids?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_muscle_group_id_fkey"
            columns: ["muscle_group_id"]
            isOneToOne: false
            referencedRelation: "muscle_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      food_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      foods: {
        Row: {
          calories_per_portion: number
          carbs_g: number
          carbs_pct: number | null
          category_id: string
          created_at: string | null
          fat_g: number
          fat_pct: number | null
          fiber_g: number | null
          household_measure: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_portion_grams: number
          min_portion_label: string
          name: string
          protein_g: number
          protein_pct: number | null
          updated_at: string | null
        }
        Insert: {
          calories_per_portion: number
          carbs_g?: number
          carbs_pct?: number | null
          category_id: string
          created_at?: string | null
          fat_g?: number
          fat_pct?: number | null
          fiber_g?: number | null
          household_measure?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_portion_grams: number
          min_portion_label: string
          name: string
          protein_g?: number
          protein_pct?: number | null
          updated_at?: string | null
        }
        Update: {
          calories_per_portion?: number
          carbs_g?: number
          carbs_pct?: number | null
          category_id?: string
          created_at?: string | null
          fat_g?: number
          fat_pct?: number | null
          fiber_g?: number | null
          household_measure?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_portion_grams?: number
          min_portion_label?: string
          name?: string
          protein_g?: number
          protein_pct?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foods_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      injury_types: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      meal_food_items: {
        Row: {
          calories: number
          carbs_g: number
          created_at: string | null
          fat_g: number
          food_id: string
          id: string
          meal_id: string
          notes: string | null
          order_in_meal: number
          protein_g: number
          quantity: number
          quantity_label: string
          substitute_food_ids: string[] | null
          unit: string
        }
        Insert: {
          calories: number
          carbs_g?: number
          created_at?: string | null
          fat_g?: number
          food_id: string
          id?: string
          meal_id: string
          notes?: string | null
          order_in_meal: number
          protein_g?: number
          quantity: number
          quantity_label: string
          substitute_food_ids?: string[] | null
          unit: string
        }
        Update: {
          calories?: number
          carbs_g?: number
          created_at?: string | null
          fat_g?: number
          food_id?: string
          id?: string
          meal_id?: string
          notes?: string | null
          order_in_meal?: number
          protein_g?: number
          quantity?: number
          quantity_label?: string
          substitute_food_ids?: string[] | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_food_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_food_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "diet_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      muscle_groups: {
        Row: {
          body_region: string
          created_at: string | null
          id: string
          name: string
          name_en: string | null
          updated_at: string | null
        }
        Insert: {
          body_region: string
          created_at?: string | null
          id?: string
          name: string
          name_en?: string | null
          updated_at?: string | null
        }
        Update: {
          body_region?: string
          created_at?: string | null
          id?: string
          name?: string
          name_en?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          paid_at: string | null
          payment_method: string | null
          refunded_at: string | null
          status: string
          stripe_payment_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          refunded_at?: string | null
          status: string
          stripe_payment_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          refunded_at?: string | null
          status?: string
          stripe_payment_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          biggest_motivation: string | null
          biological_sex: string | null
          body_feeling: string | null
          cooking_habit: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          fitness_level: string | null
          food_relationship: string | null
          height_cm: number | null
          hunger_pattern: string | null
          id: string
          imc: number | null
          imc_label: string | null
          macro_carbs_g: number | null
          macro_fat_g: number | null
          macro_protein_g: number | null
          main_goal: string | null
          meals_per_day: number | null
          questionnaire_completed_at: string | null
          session_duration: string | null
          sleep_quality: string | null
          stress_level: number | null
          tdee: number | null
          tdee_adjusted: number | null
          tmb: number | null
          training_days_per_week: number | null
          training_location: string | null
          updated_at: string | null
          water_intake: string | null
          weight_kg: number | null
          work_style: string | null
        }
        Insert: {
          age?: number | null
          biggest_motivation?: string | null
          biological_sex?: string | null
          body_feeling?: string | null
          cooking_habit?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          fitness_level?: string | null
          food_relationship?: string | null
          height_cm?: number | null
          hunger_pattern?: string | null
          id: string
          imc?: number | null
          imc_label?: string | null
          macro_carbs_g?: number | null
          macro_fat_g?: number | null
          macro_protein_g?: number | null
          main_goal?: string | null
          meals_per_day?: number | null
          questionnaire_completed_at?: string | null
          session_duration?: string | null
          sleep_quality?: string | null
          stress_level?: number | null
          tdee?: number | null
          tdee_adjusted?: number | null
          tmb?: number | null
          training_days_per_week?: number | null
          training_location?: string | null
          updated_at?: string | null
          water_intake?: string | null
          weight_kg?: number | null
          work_style?: string | null
        }
        Update: {
          age?: number | null
          biggest_motivation?: string | null
          biological_sex?: string | null
          body_feeling?: string | null
          cooking_habit?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          fitness_level?: string | null
          food_relationship?: string | null
          height_cm?: number | null
          hunger_pattern?: string | null
          id?: string
          imc?: number | null
          imc_label?: string | null
          macro_carbs_g?: number | null
          macro_fat_g?: number | null
          macro_protein_g?: number | null
          main_goal?: string | null
          meals_per_day?: number | null
          questionnaire_completed_at?: string | null
          session_duration?: string | null
          sleep_quality?: string | null
          stress_level?: number | null
          tdee?: number | null
          tdee_adjusted?: number | null
          tmb?: number | null
          training_days_per_week?: number | null
          training_location?: string | null
          updated_at?: string | null
          water_intake?: string | null
          weight_kg?: number | null
          work_style?: string | null
        }
        Relationships: []
      }
      questionnaire_answers: {
        Row: {
          answers: Json
          completed: boolean | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          answers: Json
          completed?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          version?: string
        }
        Update: {
          answers?: Json
          completed?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          includes_challenges: boolean | null
          includes_diet: boolean | null
          includes_sleep_guide: boolean | null
          includes_supplementation: boolean | null
          includes_weekly_renewal: boolean | null
          includes_workout: boolean | null
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          includes_challenges?: boolean | null
          includes_diet?: boolean | null
          includes_sleep_guide?: boolean | null
          includes_supplementation?: boolean | null
          includes_weekly_renewal?: boolean | null
          includes_workout?: boolean | null
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          includes_challenges?: boolean | null
          includes_diet?: boolean | null
          includes_sleep_guide?: boolean | null
          includes_supplementation?: boolean | null
          includes_weekly_renewal?: boolean | null
          includes_workout?: boolean | null
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          slug?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle: string
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dietary_restrictions: {
        Row: {
          created_at: string | null
          dietary_restriction_type_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dietary_restriction_type_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          dietary_restriction_type_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dietary_restrictions_dietary_restriction_type_id_fkey"
            columns: ["dietary_restriction_type_id"]
            isOneToOne: false
            referencedRelation: "dietary_restriction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dietary_restrictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dietary_restrictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_injuries: {
        Row: {
          created_at: string | null
          id: string
          injury_type_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          injury_type_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          injury_type_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_injuries_injury_type_id_fkey"
            columns: ["injury_type_id"]
            isOneToOne: false
            referencedRelation: "injury_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_injuries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_injuries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_day_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          notes: string | null
          order_in_day: number
          reps_label: string | null
          reps_max: number | null
          reps_min: number | null
          rest_seconds: number | null
          sets: number
          technique: string | null
          tempo: string | null
          weight_suggestion: string | null
          workout_day_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_in_day: number
          reps_label?: string | null
          reps_max?: number | null
          reps_min?: number | null
          rest_seconds?: number | null
          sets: number
          technique?: string | null
          tempo?: string | null
          weight_suggestion?: string | null
          workout_day_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_in_day?: number
          reps_label?: string | null
          reps_max?: number | null
          reps_min?: number | null
          rest_seconds?: number | null
          sets?: number
          technique?: string | null
          tempo?: string | null
          weight_suggestion?: string | null
          workout_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_day_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_day_exercises_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_days: {
        Row: {
          created_at: string | null
          day_label: string
          day_of_week: string
          estimated_duration_min: number | null
          id: string
          is_rest_day: boolean | null
          muscle_group_ids: string[]
          notes: string | null
          order_in_week: number
          updated_at: string | null
          week_number: number
          workout_plan_id: string
        }
        Insert: {
          created_at?: string | null
          day_label: string
          day_of_week: string
          estimated_duration_min?: number | null
          id?: string
          is_rest_day?: boolean | null
          muscle_group_ids: string[]
          notes?: string | null
          order_in_week: number
          updated_at?: string | null
          week_number?: number
          workout_plan_id: string
        }
        Update: {
          created_at?: string | null
          day_label?: string
          day_of_week?: string
          estimated_duration_min?: number | null
          id?: string
          is_rest_day?: boolean | null
          muscle_group_ids?: string[]
          notes?: string | null
          order_in_week?: number
          updated_at?: string | null
          week_number?: number
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_days_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["active_workout_plan_id"]
          },
          {
            foreignKeyName: "workout_days_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          ai_prompt_used: string | null
          created_at: string | null
          days_per_week: number
          fitness_level: string
          generated_by_ai: boolean | null
          goal: string
          id: string
          is_active: boolean | null
          location: string
          name: string
          pdf_url: string | null
          session_duration: string
          split_type: string | null
          total_weeks: number | null
          updated_at: string | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
          week_number: number | null
        }
        Insert: {
          ai_prompt_used?: string | null
          created_at?: string | null
          days_per_week: number
          fitness_level: string
          generated_by_ai?: boolean | null
          goal: string
          id?: string
          is_active?: boolean | null
          location: string
          name?: string
          pdf_url?: string | null
          session_duration: string
          split_type?: string | null
          total_weeks?: number | null
          updated_at?: string | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
          week_number?: number | null
        }
        Update: {
          ai_prompt_used?: string | null
          created_at?: string | null
          days_per_week?: number
          fitness_level?: string
          generated_by_ai?: boolean | null
          goal?: string
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          pdf_url?: string | null
          session_duration?: string
          split_type?: string | null
          total_weeks?: number | null
          updated_at?: string | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      diet_daily_totals: {
        Row: {
          day_of_week: string | null
          diet_plan_id: string | null
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "user_full_profile"
            referencedColumns: ["active_diet_plan_id"]
          },
        ]
      }
      user_full_profile: {
        Row: {
          active_diet_plan_id: string | null
          active_workout_plan_id: string | null
          age: number | null
          biggest_motivation: string | null
          biological_sex: string | null
          body_feeling: string | null
          cooking_habit: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          fitness_level: string | null
          food_relationship: string | null
          height_cm: number | null
          hunger_pattern: string | null
          id: string | null
          imc: number | null
          imc_label: string | null
          includes_challenges: boolean | null
          includes_diet: boolean | null
          includes_workout: boolean | null
          macro_carbs_g: number | null
          macro_fat_g: number | null
          macro_protein_g: number | null
          main_goal: string | null
          meals_per_day: number | null
          plan_name: string | null
          plan_slug: string | null
          questionnaire_completed_at: string | null
          session_duration: string | null
          sleep_quality: string | null
          stress_level: number | null
          subscription_status: string | null
          tdee: number | null
          tdee_adjusted: number | null
          tmb: number | null
          training_days_per_week: number | null
          training_location: string | null
          updated_at: string | null
          water_intake: string | null
          weight_kg: number | null
          work_style: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calc_food_macros: {
        Args: { food_id: string; quantity_g: number }
        Returns: {
          calories: number
          carbs_g: number
          fat_g: number
          protein_g: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] | DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] |
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] |
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] |
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] |
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
