import type { Json } from './json';

export interface Tables {
  profiles: {
    id: string;
    created_at: string;
    updated_at: string;
    username: string;
    avatar_url: string | null;
    display_name: string | null;
    bio: string | null;
    badges: string[] | null;
    reputation: number | null;
    is_admin: boolean | null;
    is_premium: boolean | null;
    mood_points: number | null;
    achievements: string[] | null;
    premium_until: string | null;
  };
  battle_submissions: {
    battle_id: string;
    created_at: string;
    id: string;
    recipe_id: string;
    user_id: string;
    votes: number | null;
    voting_ends_at: string | null;
  };
  community_posts: {
    content: string;
    created_at: string;
    id: string;
    image_url: string | null;
    likes: number | null;
    post_type: string;
    title: string;
    type: string;
    user_id: string;
  };
  cooking_buddies: {
    buddy_id: string;
    created_at: string;
    id: string;
    status: string | null;
    user_id: string;
  };
  cooking_streaks: {
    created_at: string;
    id: string;
    last_cook_date: string;
    streak_count: number | null;
    user_id: string;
  };
  forum_categories: {
    category_type: string;
    created_at: string;
    description: string | null;
    icon: string | null;
    id: string;
    is_premium: boolean | null;
    name: string;
    updated_at: string;
  };
  forum_replies: {
    content: string;
    created_at: string;
    id: string;
    is_solution: boolean | null;
    topic_id: string | null;
    updated_at: string;
    user_id: string | null;
  };
  forum_topics: {
    category_id: string | null;
    content: string;
    created_at: string;
    emotions: string[] | null;
    has_recipe: boolean | null;
    id: string;
    ingredients: string[] | null;
    is_poll: boolean | null;
    status: string | null;
    title: string;
    updated_at: string;
    user_id: string | null;
    views: number | null;
  };
  mood_analytics: {
    created_at: string;
    id: string;
    intensity: number | null;
    mood: string;
    notes: string | null;
    user_id: string;
  };
  notifications: {
    created_at: string;
    data: Json | null;
    id: string;
    message: string;
    read: boolean | null;
    title: string;
    type: string;
    user_id: string;
  };
  poll_options: {
    created_at: string;
    id: string;
    option_text: string;
    topic_id: string | null;
  };
  poll_votes: {
    created_at: string;
    id: string;
    option_id: string | null;
    user_id: string | null;
  };
  recipes: {
    cooking_time: number | null;
    created_at: string;
    description: string | null;
    emotions: string[];
    id: string;
    image_url: string | null;
    ingredients: string[];
    instructions: string[];
    status: string | null;
    title: string;
    user_id: string | null;
    votes: number | null;
  };
  recipe_battles: {
    battle_type: string | null;
    created_at: string;
    creator_id: string;
    description: string;
    end_date: string;
    id: string;
    prize_description: string | null;
    start_date: string;
    status: string | null;
    target_mood: string;
    theme_ingredients: string[] | null;
    title: string;
  };
  recipe_comments: {
    content: string;
    created_at: string;
    id: string;
    likes: number | null;
    recipe_id: string;
    user_id: string;
  };
  recipe_interactions: {
    created_at: string;
    emotions: string[];
    id: string;
    notes: string | null;
    recipe_id: string;
    time_of_day: string;
    user_id: string;
  };
  user_achievements: {
    achievement_data: Json | null;
    achievement_type: string;
    created_at: string;
    id: string;
    user_id: string;
  };
}

export interface TablesInsert {
  profiles: Omit<Tables['profiles'], 'created_at' | 'updated_at'>;
  battle_submissions: Omit<Tables['battle_submissions'], 'created_at' | 'id'>;
  community_posts: Omit<Tables['community_posts'], 'created_at' | 'id'>;
  cooking_buddies: Omit<Tables['cooking_buddies'], 'created_at' | 'id'>;
  cooking_streaks: Omit<Tables['cooking_streaks'], 'created_at' | 'id'>;
  forum_categories: Omit<Tables['forum_categories'], 'created_at' | 'id'>;
  forum_replies: Omit<Tables['forum_replies'], 'created_at' | 'id'>;
  forum_topics: Omit<Tables['forum_topics'], 'created_at' | 'id'>;
  mood_analytics: Omit<Tables['mood_analytics'], 'created_at' | 'id'>;
  notifications: Omit<Tables['notifications'], 'created_at' | 'id'>;
  poll_options: Omit<Tables['poll_options'], 'created_at' | 'id'>;
  poll_votes: Omit<Tables['poll_votes'], 'created_at' | 'id'>;
  recipes: Omit<Tables['recipes'], 'created_at' | 'id'>;
  recipe_battles: Omit<Tables['recipe_battles'], 'created_at' | 'id'>;
  recipe_comments: Omit<Tables['recipe_comments'], 'created_at' | 'id'>;
  recipe_interactions: Omit<Tables['recipe_interactions'], 'created_at' | 'id'>;
  user_achievements: Omit<Tables['user_achievements'], 'created_at' | 'id'>;
}

export interface TablesUpdate {
  profiles: Partial<TablesInsert['profiles']>;
  battle_submissions: Partial<TablesInsert['battle_submissions']>;
  community_posts: Partial<TablesInsert['community_posts']>;
  cooking_buddies: Partial<TablesInsert['cooking_buddies']>;
  cooking_streaks: Partial<TablesInsert['cooking_streaks']>;
  forum_categories: Partial<TablesInsert['forum_categories']>;
  forum_replies: Partial<TablesInsert['forum_replies']>;
  forum_topics: Partial<TablesInsert['forum_topics']>;
  mood_analytics: Partial<TablesInsert['mood_analytics']>;
  notifications: Partial<TablesInsert['notifications']>;
  poll_options: Partial<TablesInsert['poll_options']>;
  poll_votes: Partial<TablesInsert['poll_votes']>;
  recipes: Partial<TablesInsert['recipes']>;
  recipe_battles: Partial<TablesInsert['recipe_battles']>;
  recipe_comments: Partial<TablesInsert['recipe_comments']>;
  recipe_interactions: Partial<TablesInsert['recipe_interactions']>;
  user_achievements: Partial<TablesInsert['user_achievements']>;
}