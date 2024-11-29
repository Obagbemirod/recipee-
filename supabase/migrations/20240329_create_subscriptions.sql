create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  plan_id text not null,
  status text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  payment_reference text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Add RLS policies
alter table public.subscriptions enable row level security;

-- Allow users to read their own subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Allow authenticated users to insert their own subscriptions
create policy "Users can insert own subscriptions"
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

-- Create index for faster queries
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_status_idx on public.subscriptions(status);