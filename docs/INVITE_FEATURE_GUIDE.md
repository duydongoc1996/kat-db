# 👥 User Invite Feature Guide

## Overview

The app now allows you to invite other authenticated users to manage your baby! No emails needed - just select from a dropdown of registered users.

## How It Works

### Step 1: Other users must sign in first
1. Share your app URL with dad, grandparents, etc.
2. They visit the URL and sign in with their Google account
3. They'll see "No babies yet" (that's normal!)

### Step 2: You invite them
1. Go to **Babies** (Bé yêu) page
2. Find your baby in the list
3. Click **"Invite Users"** button
4. Select the user from dropdown (shows their name/email)
5. Choose their role: Mom, Dad, or Other
6. Click **"Invite User"**
7. Done! They now have access

### Step 3: They can now access the baby
1. They refresh the app
2. They'll see the baby in their list
3. They can record metrics and view analytics
4. Everyone has equal access!

## Features

### On Babies Page
Each baby card shows:
- Baby name and birth date
- Your role (Mom/Dad/Other)
- **"Invite Users"** button

### When You Click "Invite Users"
Shows:
1. **User dropdown** - All authenticated users
2. **Role selector** - Mom, Dad, or Other
3. **Invite button**
4. **Current Members list** with:
   - Name and email
   - Role
   - Remove button (for each member except yourself)

### Member Management
- View all members who have access
- See their roles
- Remove members (except yourself)
- Everyone has equal permissions

## User Roles

All roles have **equal permissions** - just for display:
- **Mom** (Mẹ) - Mother
- **Dad** (Bố) - Father
- **Other** (Khác) - Grandparents, babysitters, etc.

## Example Scenarios

### Scenario 1: Single Mom
1. Mom creates baby "Kat"
2. Grandma signs in to the app
3. Mom invites Grandma (role: Other)
4. Grandma can now track when she babysits

### Scenario 2: Both Parents
1. Mom creates baby, role: Mom
2. Dad signs in to the app
3. Mom invites Dad, role: Dad
4. Both can record and view everything

### Scenario 3: Extended Family
1. Mom creates baby
2. Dad signs in → Mom invites as Dad
3. Grandma signs in → Mom invites as Other
4. Babysitter signs in → Dad invites as Other
5. Everyone can manage the baby equally

## SQL Setup Required

Before this works, run in Supabase SQL Editor:

### 1. Update Role Values
```bash
Run: UPDATE_ROLE_VALUES.sql
```

This changes roles from 'owner/admin/member' to 'mom/dad/other'

### 2. Enable User Listing
```bash
Run: ENABLE_USER_LISTING.sql
```

This creates a function to query all authenticated users

## Technical Details

### Database Function
```sql
get_all_users()
-- Returns: id, email, full_name, avatar_url
-- For all authenticated users
```

### How Invite Works
1. User selects another user from dropdown
2. App calls `supabase.from('baby_users').insert()`
3. Creates record linking user to baby
4. RLS automatically grants access
5. Other user sees baby in their list immediately

### Security
- Only authenticated users can be invited
- You must have access to a baby to invite others
- Can't invite same user twice
- Can remove any member (except yourself)
- All done via RLS policies

## UI/UX Flow

```
Babies Page
  ├─ Your Babies List
  │   └─ For each baby:
  │       ├─ Baby info card
  │       ├─ [Invite Users] button
  │       └─ When clicked:
  │           ├─ User dropdown (all users)
  │           ├─ Role selector (mom/dad/other)
  │           ├─ [Invite User] button
  │           └─ Current Members list
  │               ├─ Member 1 [Remove]
  │               ├─ Member 2 [Remove]
  │               └─ You (can't remove)
  │
  └─ [Add Baby] button
```

## Common Workflows

### Inviting Dad
1. Dad signs in first (gets his own empty account)
2. Mom goes to Babies page
3. Mom clicks "Invite Users" on her baby
4. Selects dad's email from dropdown
5. Sets role to "Dad"
6. Clicks "Invite User"
7. Dad refreshes → Sees baby in his list

### Managing Multiple Caregivers
1. All caregivers sign in once
2. Primary caregiver invites everyone
3. Each sets appropriate role
4. Everyone sees the baby
5. Everyone can record and view data

### Removing Access
1. Go to Babies page
2. Click "Invite Users" on the baby
3. Find the member in "Current Members"
4. Click "Remove" next to their name
5. Confirm
6. They lose access immediately

## Best Practices

### 1. Ask people to sign in FIRST
- Have them visit the app and sign in with Google
- Then you can invite them (they'll appear in dropdown)

### 2. Set meaningful roles
- Mom/Dad for parents
- Other for everyone else
- Roles are just labels, not restrictions

### 3. Communicate with your team
- Tell them when you invite them
- They need to refresh to see the baby
- Explain they have full access

### 4. Be careful with Remove
- Removed users lose ALL access
- They won't see the baby or data anymore
- Can re-invite them if needed

## Limitations

- Can't invite someone who hasn't signed in yet
- No email notification (they must check the app)
- Can't send invites to email addresses
- Must manually tell them they've been added

## Future Enhancements

Possible improvements:
- Email invitations
- Push notifications when invited
- Pending invites (accept/reject)
- Custom roles (nurse, doctor, etc.)
- Invite by email (auto-creates account)
- Invite links (share URL)

## Troubleshooting

### "User doesn't appear in dropdown"
- They must sign in to the app first
- Check they used Google OAuth
- Refresh your page

### "Failed to invite user"
- Check user isn't already invited
- Verify RLS policies are set up
- Check browser console for errors

### "Members list empty"
- Give it a second to load
- Check console for errors
- Verify ENABLE_USER_LISTING.sql was run

### "Can't remove member"
- Can't remove yourself
- Check you have access to the baby
- Verify RLS allows DELETE

## Database Queries Used

### Get all users
```javascript
await supabase.rpc('get_all_users')
```

### Get baby members
```javascript
await supabase
  .from('baby_users')
  .select('*')
  .eq('baby_id', babyId)
```

### Invite user
```javascript
await supabase
  .from('baby_users')
  .insert([{
    baby_id: babyId,
    user_id: userId,
    role: 'mom', // or 'dad', 'other'
    added_by: currentUser.id
  }])
```

### Remove user
```javascript
await supabase
  .from('baby_users')
  .delete()
  .eq('id', babyUserId)
```

## Summary

✅ **No emails needed** - Select from authenticated users  
✅ **Simple UI** - Dropdown + button  
✅ **Member list** - See who has access  
✅ **Remove capability** - Easy management  
✅ **Multi-language** - English & Vietnamese  
✅ **Real-time** - Changes apply immediately  

Perfect for families and small care teams! 👨‍👩‍👧‍👦

---

**Required SQL**: Run `UPDATE_ROLE_VALUES.sql` and `ENABLE_USER_LISTING.sql` before using this feature!
