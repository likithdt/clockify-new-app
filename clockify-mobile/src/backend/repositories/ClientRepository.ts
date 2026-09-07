import type { Client } from "../types.ts";

export interface IClientRepository {
  getAll(): Promise<Client[]>;
  create(name: string, currency: string, address?: string): Promise<Client>;
  archive(id: string): Promise<Client | null>;
  delete(id: string): Promise<boolean>;
}

const INITIAL_CLIENTS: Client[] = [
  { id: "client-1", name: "[SAMPLE] Client A", currency: "USD", isArchived: false },
  { id: "client-2", name: "[SAMPLE] Client B", currency: "EUR", isArchived: false },
];

export class ClientRepository implements IClientRepository {
  private clients: Client[] = [...INITIAL_CLIENTS];

  async getAll(): Promise<Client[]> {
    return [...this.clients];
  }

  async create(name: string, currency: string = "USD", address?: string): Promise<Client> {
    const client: Client = {
      id: `client-${Date.now()}`,
      name,
      currency,
      address,
      isArchived: false,
    };
    this.clients.unshift(client);
    return client;
  }

  async archive(id: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.id === id);
    if (!client) return null;
    client.isArchived = !client.isArchived;
    return { ...client };
  }

  async delete(id: string): Promise<boolean> {
    const prev = this.clients.length;
    this.clients = this.clients.filter((c) => c.id !== id);
    return this.clients.length < prev;
  }
}

export const clientRepository = new ClientRepository();
