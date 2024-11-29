create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  plan_id text not null,
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone not null,
  status text not null,
  payment_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.subscriptions enable row level security;

-- Create policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- Add updated_at trigger
create function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function handle_updated_at();

-- Create indexes for better query performance
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_status_idx on public.subscriptions(status);
create index subscriptions_end_date_idx on public.subscriptions(end_date);