import { writable } from 'svelte/store';
import type { Location, Customer, Service, Order } from './types';

export const locations = writable<Location[]>([]);
export const customers = writable<Customer[]>([]);
export const services = writable<Service[]>([]);
export const orders = writable<Order[]>([]);
export const currentUser = writable<any>(null); 