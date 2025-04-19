<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  
  // Define types for submission data
  type ContactSubmission = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'completed' | 'spam';
    created_at: string;
    updated_at: string;
  };
  
  let submissions: ContactSubmission[] = [];
  let loading = true;
  let error: string | null = null;
  let statusFilter = 'all';
  
  const statusOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'spam', label: 'Spam' }
  ];
  
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    spam: 'bg-red-100 text-red-800'
  };
  
  // Format date string to a more readable format
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  async function loadSubmissions(): Promise<void> {
    loading = true;
    error = null;
    
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error: err } = await query;
      
      if (err) throw err;
      
      submissions = data as ContactSubmission[] || [];
    } catch (err) {
      console.error('Error loading contact submissions:', err);
      error = 'Failed to load contact submissions. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  async function updateStatus(id: number, newStatus: 'new' | 'in_progress' | 'completed' | 'spam'): Promise<void> {
    try {
      const { error: err } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (err) throw err;
      
      // Update local state to reflect the change
      submissions = submissions.map(sub => 
        sub.id === id ? { ...sub, status: newStatus } : sub
      );
    } catch (err) {
      console.error('Error updating submission status:', err);
      alert('Failed to update status. Please try again.');
    }
  }
  
  async function deleteSubmission(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error: err } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      
      if (err) throw err;
      
      // Remove the deleted submission from local state
      submissions = submissions.filter(sub => sub.id !== id);
    } catch (err) {
      console.error('Error deleting submission:', err);
      alert('Failed to delete message. Please try again.');
    }
  }
  
  // Watch for statusFilter changes and reload data
  $: if (statusFilter) {
    loadSubmissions();
  }
  
  onMount(() => {
    loadSubmissions();
  });
</script>

<div class="bg-white shadow-sm rounded-lg overflow-hidden">
  <div class="p-6 border-b border-gray-200">
    <h1 class="text-2xl font-bold text-gray-900">Contact Messages</h1>
    <p class="mt-1 text-sm text-gray-500">Manage contact form submissions from website visitors</p>
  </div>
  
  <!-- Filter controls -->
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <div class="flex flex-wrap items-center gap-4">
      <div>
        <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          id="statusFilter" 
          bind:value={statusFilter}
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
          {#each statusOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="ml-auto">
        <button 
          on:click={() => loadSubmissions()}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  </div>
  
  <!-- Loading state -->
  {#if loading}
    <div class="p-8 text-center">
      <div class="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading messages...</p>
    </div>
  {/if}
  
  <!-- Error state -->
  {#if error && !loading}
    <div class="p-8 text-center bg-red-50">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-2 text-red-800">{error}</p>
      <button 
        on:click={() => loadSubmissions()}
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Try Again
      </button>
    </div>
  {/if}
  
  <!-- Submissions table -->
  {#if !loading && !error}
    {#if submissions.length === 0}
      <div class="p-8 text-center bg-gray-50">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="mt-2 text-gray-600">No messages found</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each submissions as submission (submission.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{submission.name}</div>
                  <div class="text-sm text-gray-500">{submission.email}</div>
                  {#if submission.phone}
                    <div class="text-sm text-gray-500">{submission.phone}</div>
                  {/if}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{submission.subject}</div>
                  <div class="text-sm text-gray-500 mt-1 line-clamp-2">{submission.message}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(submission.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {statusColors[submission.status] || 'bg-gray-100 text-gray-800'}">
                    {submission.status === 'in_progress' ? 'In Progress' : 
                      submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end items-center space-x-2">
                    <div class="relative" tabindex="-1">
                      <button 
                        class="text-gray-500 hover:text-gray-700 focus:outline-none"
                        on:click={() => {
                          const menu = document.getElementById(`status-menu-${submission.id}`);
                          if (menu) menu.classList.toggle('hidden');
                        }}
                      >
                        <span class="sr-only">Change status</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <div id="status-menu-{submission.id}" class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div class="py-1" role="menu" aria-orientation="vertical">
                          {#each statusOptions.filter(o => o.value !== 'all' && o.value !== submission.status) as option}
                            <button 
                              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                              role="menuitem"
                              on:click={() => {
                                updateStatus(submission.id, option.value as 'new' | 'in_progress' | 'completed' | 'spam');
                                const menu = document.getElementById(`status-menu-${submission.id}`);
                                if (menu) menu.classList.add('hidden');
                              }}
                            >
                              Mark as {option.label}
                            </button>
                          {/each}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      class="text-blue-600 hover:text-blue-900"
                      on:click={() => {
                        const detailsEl = document.getElementById(`message-details-${submission.id}`);
                        if (detailsEl) detailsEl.classList.toggle('hidden');
                      }}
                    >
                      <span class="sr-only">View</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button 
                      class="text-red-600 hover:text-red-900"
                      on:click={() => deleteSubmission(submission.id)}
                    >
                      <span class="sr-only">Delete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Message details (hidden by default) -->
              <tr id="message-details-{submission.id}" class="hidden bg-gray-50">
                <td colspan="5" class="px-6 py-4">
                  <div class="border border-gray-200 rounded-md bg-white p-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">{submission.subject}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p class="text-sm text-gray-500">From: <span class="text-gray-900">{submission.name}</span></p>
                        <p class="text-sm text-gray-500">Email: <a href="mailto:{submission.email}" class="text-blue-600 hover:text-blue-800">{submission.email}</a></p>
                        {#if submission.phone}
                          <p class="text-sm text-gray-500">Phone: <a href="tel:{submission.phone}" class="text-blue-600 hover:text-blue-800">{submission.phone}</a></p>
                        {/if}
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Received: <span class="text-gray-900">{formatDate(submission.created_at)}</span></p>
                        <p class="text-sm text-gray-500">Updated: <span class="text-gray-900">{formatDate(submission.updated_at)}</span></p>
                        <p class="text-sm text-gray-500">Status: 
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {statusColors[submission.status] || 'bg-gray-100 text-gray-800'}">
                            {submission.status === 'in_progress' ? 'In Progress' : 
                              submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-md p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Message</h4>
                      <p class="text-sm text-gray-800 whitespace-pre-line">{submission.message}</p>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div> 