import type { Request } from "@/lib/types/global/Global";
import type { Client, ClientMore, AllClient } from "../domain/Client";
import type { MethodsClients, Repository, StateClient } from "../domain/Repository";

export const ClientRepository = (repository: Repository) => ({
    postClient: async (data: Client) => {
        return await repository.postClient(data)
    },
    updateClient: async (data: Partial<Client>) => {
        return await repository.updateClient(data)
    },
    getClient: async (id: number) => {
       return await repository.getClient(id)
    },
    deleteClient: async (id: number) => {
        return await repository.deleteClient(id)
    },
    getStatus: async () => {
        return await repository.getStatus()
    },
    getClientInitial: async (methods: MethodsClients) => {
        return await repository.getClientInitial(methods)
    },
    getClients: async (methods: MethodsClients) => {
        return await repository.getClients(methods)
    },
    changeState: async (id: number, state: StateClient) => {
        return await repository.changeState(id, state)
    }
})