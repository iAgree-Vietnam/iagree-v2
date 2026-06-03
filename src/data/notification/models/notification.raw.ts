export interface RawNotificationResource {
  id: number;
  user_id: number;
  type: number;
  type_id: number;
  name: string;
  description: string;
  date: string;
  note: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  item_name: string | null;
}
