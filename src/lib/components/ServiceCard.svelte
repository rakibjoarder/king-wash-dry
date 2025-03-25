<script lang="ts">
  import type { Service } from '$lib/types';
  
  export let service: Service;
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900">{service.name}</h3>
    <p class="mt-2 text-gray-600">{service.description}</p>
    <div class="mt-4 flex justify-between items-center">
      <span class="text-lg font-medium text-primary-600">${service.price.toFixed(2)}</span>
      <span class="text-sm text-gray-500">Turnaround: {service.turnaround_time}</span>
    </div>
  </div>
</div> 