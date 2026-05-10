import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceProfileId,
  ExecutivePresenceScores,
  TraitKey
} from "@/src/types/executivePresence";
import type {
  ContentIntensity,
  EditorialCtaType,
  EditorialFormat,
  EditorialHookType,
  EditorialMoment,
  EditorialObjective,
  EditorialPlatform,
  EditorialScienceBase
} from "@/types/content";
import type { AutomationMode } from "@/types/automation";

export type CalendarStatus = "planned" | "drafted" | "approved" | "exported" | "published" | "archived";
export type ExportStatus = "not_exported" | "ready" | "image_generated" | "exported" | "failed";

export type ContentCalendarRow = {
  id: string;
  user_id: string;
  date: string;
  moment_of_day: EditorialMoment;
  platform: EditorialPlatform;
  format: EditorialFormat;
  objective: EditorialObjective;
  science_base: EditorialScienceBase;
  theme: string;
  hook_type: EditorialHookType;
  cta_type: EditorialCtaType;
  strategic_reason: string;
  status: CalendarStatus;
  created_at: string;
};

export type GeneratedPostRow = {
  id: string;
  user_id: string;
  calendar_id: string | null;
  date: string;
  moment_of_day: EditorialMoment;
  platform: EditorialPlatform;
  format: EditorialFormat;
  objective: EditorialObjective;
  science_base: EditorialScienceBase;
  theme: string;
  hook_type: EditorialHookType;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  caption: string | null;
  hashtags: string[];
  cta: string | null;
  pinned_comment: string | null;
  image_prompt: string | null;
  visual_style_id: string | null;
  image_url: string | null;
  export_status: ExportStatus;
  prompt_tokens_estimate: number;
  completion_tokens_estimate: number;
  total_tokens_estimate: number;
  estimated_cost: number;
  created_at: string;
};

export type GeneratedPostImageRow = {
  id: string;
  user_id: string;
  generated_post_id: string;
  format: EditorialFormat;
  ratio: "1:1" | "4:5" | "9:16";
  card_index: number;
  bucket: string;
  storage_path: string;
  image_url: string;
  prompt: string;
  negative_prompt: string;
  provider: string;
  estimated_cost: number;
  export_status: ExportStatus;
  created_at: string;
};

export type ContentThemeRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  science_base: EditorialScienceBase;
  emotional_angle: string;
  recommended_formats: EditorialFormat[];
  active: boolean;
  created_at: string;
};

export type VisualStyleRow = {
  id: string;
  user_id: string;
  name: string;
  background: string;
  palette: string[];
  elements: string[];
  typography: string;
  mood: string;
  prompt_fragment: string;
  active: boolean;
  created_at: string;
};

export type CtaRow = {
  id: string;
  user_id: string;
  type: EditorialCtaType;
  text: string;
  objective: EditorialObjective;
  intensity: ContentIntensity;
  active: boolean;
  created_at: string;
};

export type GenerationHistoryRow = {
  id: string;
  user_id: string;
  generated_post_id: string | null;
  format: EditorialFormat;
  objective: EditorialObjective;
  science_base: EditorialScienceBase;
  theme: string;
  hook_type: EditorialHookType;
  cta_type: EditorialCtaType;
  prompt_tokens_estimate: number;
  completion_tokens_estimate: number;
  total_tokens_estimate: number;
  estimated_cost: number;
  generation_source: string;
  provider_used: string | null;
  model_used: string | null;
  fallback_used: boolean;
  error_message: string | null;
  created_at: string;
};

export type AiGenerationUsageRow = {
  id: string;
  user_id: string;
  generated_post_id: string | null;
  generation_date: string;
  model: string;
  provider_used: string | null;
  fallback_used: boolean;
  error_message: string | null;
  prompt_tokens_estimate: number;
  completion_tokens_estimate: number;
  total_tokens_estimate: number;
  estimated_cost: number;
  created_at: string;
};

export type UserGenerationLimitRow = {
  user_id: string;
  daily_cost_limit: number;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  current_role: string | null;
  industry: string | null;
  career_goal: string | null;
  preferred_style: string | null;
  active_executive_presence_result_id: string | null;
  executive_presence_profile_id: ExecutivePresenceProfileId | string | null;
  executive_presence_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GeneratedScriptRow = {
  id: string;
  user_id: string;
  situation: string;
  context: string | null;
  desired_outcome: string | null;
  people_involved: string | null;
  tone: string | null;
  ai_response: string;
  generation_mode: "ai_compact" | "deterministic_fallback" | string | null;
  fallback_used: boolean | null;
  prompt_tokens_estimate: number | null;
  completion_tokens_estimate: number | null;
  total_tokens_estimate: number | null;
  created_at: string;
};

export type SavedScriptRow = {
  id: string;
  user_id: string;
  title: string;
  situation: string | null;
  tone: string | null;
  content: string;
  created_at: string;
};

export type ExecutivePresenceResultRow = {
  id: string;
  user_id: string;
  profile_id: ExecutivePresenceProfileId | string;
  primary_trait: TraitKey | string;
  secondary_trait: TraitKey | string | null;
  confidence_level: ConfidenceLevel | string | null;
  scores: ExecutivePresenceScores;
  answers: ExecutivePresenceAnswer[];
  created_at: string;
};

export type AutomationSettingsRow = {
  user_id: string;
  daily_generation_limit: number;
  weekly_generation_limit: number;
  monthly_cost_limit: number;
  mode: AutomationMode;
  automatic_generation_enabled: boolean;
  locked_weekly_themes: string[];
  created_at: string;
  updated_at: string;
};

export type GenerationCacheRow = {
  id: string;
  user_id: string;
  cache_key: string;
  mode: AutomationMode;
  plan_fingerprint: string;
  generated_payload: unknown;
  prompt_tokens_estimate: number;
  completion_tokens_estimate: number;
  total_tokens_estimate: number;
  estimated_cost: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Pick<ProfileRow, "id"> & {
          full_name?: string | null;
          current_role?: string | null;
          industry?: string | null;
          career_goal?: string | null;
          preferred_style?: string | null;
          active_executive_presence_result_id?: string | null;
          executive_presence_profile_id?: ExecutivePresenceProfileId | string | null;
          executive_presence_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
        Relationships: [];
      };
      generated_scripts: {
        Row: GeneratedScriptRow;
        Insert: Omit<GeneratedScriptRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GeneratedScriptRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      saved_scripts: {
        Row: SavedScriptRow;
        Insert: Omit<SavedScriptRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SavedScriptRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      executive_presence_results: {
        Row: ExecutivePresenceResultRow;
        Insert: Omit<ExecutivePresenceResultRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ExecutivePresenceResultRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      content_calendar: {
        Row: ContentCalendarRow;
        Insert: Omit<ContentCalendarRow, "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: CalendarStatus;
        };
        Update: Partial<Omit<ContentCalendarRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      generated_posts: {
        Row: GeneratedPostRow;
        Insert: Omit<
          GeneratedPostRow,
          "id" | "created_at" | "export_status" | "prompt_tokens_estimate" | "completion_tokens_estimate" | "total_tokens_estimate" | "estimated_cost"
        > & {
          id?: string;
          created_at?: string;
          export_status?: ExportStatus;
          prompt_tokens_estimate?: number;
          completion_tokens_estimate?: number;
          total_tokens_estimate?: number;
          estimated_cost?: number;
        };
        Update: Partial<Omit<GeneratedPostRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      generated_post_images: {
        Row: GeneratedPostImageRow;
        Insert: Omit<GeneratedPostImageRow, "id" | "created_at" | "export_status"> & {
          id?: string;
          created_at?: string;
          export_status?: ExportStatus;
        };
        Update: Partial<Omit<GeneratedPostImageRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      content_themes: {
        Row: ContentThemeRow;
        Insert: Omit<ContentThemeRow, "id" | "created_at" | "active"> & {
          id?: string;
          created_at?: string;
          active?: boolean;
        };
        Update: Partial<Omit<ContentThemeRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      visual_styles: {
        Row: VisualStyleRow;
        Insert: Omit<VisualStyleRow, "id" | "created_at" | "active"> & {
          id?: string;
          created_at?: string;
          active?: boolean;
        };
        Update: Partial<Omit<VisualStyleRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      ctas: {
        Row: CtaRow;
        Insert: Omit<CtaRow, "id" | "created_at" | "active"> & {
          id?: string;
          created_at?: string;
          active?: boolean;
        };
        Update: Partial<Omit<CtaRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      generation_history: {
        Row: GenerationHistoryRow;
        Insert: Omit<
          GenerationHistoryRow,
          | "id"
          | "created_at"
          | "prompt_tokens_estimate"
          | "completion_tokens_estimate"
          | "total_tokens_estimate"
          | "estimated_cost"
          | "generation_source"
          | "provider_used"
          | "model_used"
          | "fallback_used"
          | "error_message"
        > & {
          id?: string;
          created_at?: string;
          prompt_tokens_estimate?: number;
          completion_tokens_estimate?: number;
          total_tokens_estimate?: number;
          estimated_cost?: number;
          generation_source?: string;
          provider_used?: string | null;
          model_used?: string | null;
          fallback_used?: boolean;
          error_message?: string | null;
        };
        Update: Partial<Omit<GenerationHistoryRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      ai_generation_usage: {
        Row: AiGenerationUsageRow;
        Insert: Omit<
          AiGenerationUsageRow,
          "id" | "created_at" | "generation_date" | "provider_used" | "fallback_used" | "error_message"
        > & {
          id?: string;
          created_at?: string;
          generation_date?: string;
          provider_used?: string | null;
          fallback_used?: boolean;
          error_message?: string | null;
        };
        Update: Partial<Omit<AiGenerationUsageRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
      user_generation_limits: {
        Row: UserGenerationLimitRow;
        Insert: Pick<UserGenerationLimitRow, "user_id"> & {
          daily_cost_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserGenerationLimitRow, "user_id" | "created_at">>;
        Relationships: [];
      };
      automation_settings: {
        Row: AutomationSettingsRow;
        Insert: Pick<AutomationSettingsRow, "user_id"> & {
          daily_generation_limit?: number;
          weekly_generation_limit?: number;
          monthly_cost_limit?: number;
          mode?: AutomationMode;
          automatic_generation_enabled?: boolean;
          locked_weekly_themes?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AutomationSettingsRow, "user_id" | "created_at">>;
        Relationships: [];
      };
      generation_cache: {
        Row: GenerationCacheRow;
        Insert: Omit<GenerationCacheRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GenerationCacheRow, "id" | "created_at" | "user_id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
