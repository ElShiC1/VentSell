import { create } from "zustand";
import type { Request, SchemaError } from "../../../lib/types/global/Global";
import { validateData } from "../../../lib/helpers/zodError";
import { createRequestStore } from '@/lib/store/RequestStore';
import type { Client, ClientMore } from "../domain/Client";
import type { Repository, StateClient } from "../domain/Repository";
import { SchemaClient } from "../domain/Schema";

interface ClienStore {
    form: Partial<Client>
    open: boolean,
    request: Request<Client>,
    error: SchemaError<Client>,
    setForm: (form: Partial<Client>) => void
    postForm: () => ClientMore
    getClientId: (id: number) => Promise<ClientMore | false>,
    updateForm: () => ClientMore
    deleteForm: (id: number) => ClientMore
    changeStatus: (id: number, status: StateClient) => Request<ClientMore>
    setOpen: (open: boolean) => void
    
}

export const StoreClient = (repository: Repository) => create<ClienStore>((set, get) => {

    const request = createRequestStore(set)
    console.log(request, 'cuantas veces se ejecuta esto weon')

    return {
        form: {},
        open: false,
        error: {
            data: {},
            success: false
        },
        request: {
            loading: null,
            success: null,
            message: undefined,
            data: undefined
        },
        setForm: (form) => {
            const state = get()
            const validate = validateData(SchemaClient, state.form)

            set(({ form: { ...state.form, ...form }, error: !validate.success ? validate : { success: true, data: {} } }))
        },
        postForm: async () => {
            try {

                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Creando producto...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: true
                });
                const result = await repository.postClient(get().form as Client);
                console.log(result, 'esto pasa entonces')
                request.clearMessage()
                get().setOpen(false)
                set({ request: result })
                return result.data
            } catch (error) {
                console.log(error, 'por que mrd no puestras el error')
                request.handleError(error, "Error al crear Cliente")
                request.clearMessage()
            }
        },
        deleteForm: async (id) => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Creando producto...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const result = await repository.deleteClient(id);
                set({ request: result })
                request.clearMessage()
                return result.data
            } catch (error) {
                request.handleError(error,  'Error al eliminar producto')
                request.clearMessage()
            }
        },
        updateForm: async () => {
            try {
                set({
                    request: {
                        loading: true, success: false, message: {
                            text: 'Creando producto...',
                            type: 'loading',
                            animation: true
                        },
                    }, open: false
                });
                const result = await repository.updateClient(get().form);
                set({ request: result })
                request.clearMessage()
                get().setOpen(false)
                return result.data
            } catch (error) {
                request.handleError(error, 'Error al editar producto')
                request.clearMessage()
            }
        },
        getClientId: async (id) => {
            try {
                const result = await repository.getClient(id);
                set({ form: { ...result.data } })
                return result.data
            } catch (error) {
                return false
            }
        },
        changeStatus: async (id, status) => {
            try {
                const result = await repository.changeState(id, status);
                set({ request: result })
                request.clearMessage()
                return result.data
            } catch (error) {
                request.handleError(error, 'Error al eliminar producto')
                request.clearMessage()
            }
        },
        setOpen: (open) => {
            if (!open) {
                set({ form: {}, error: { success: false, data: {} }, open })
                return;
            }
            set({ open })
        }
    }
})