import {auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface Todo {
    id?: string;
    title: string;
    description: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const firestoreService = {
    getTodoRef(){
        const uid = auth.currentUser?.uid;
        if(!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'todos');
    },

    async addTodo(todo: Omit<Todo, 'id'>){
        try {
            const todoRef = this.getTodoRef();
            const docRef = await addDoc(todoRef,{
                ...todo,
                status:false,
                sreatedAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error){
            console.error('Error Tambah Todo:', error);
            throw error;
        }
    },

    async getTodos(): Promise<Todo[]> {
        try {
            const todoRef = this.getTodoRef();
            const q = query(todoRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Todo));
        } catch (error) {
            console.error('Error Get Todos:', error);
            throw error;
        }
    },

    async updateTodo(id: string, todo: Partial<Todo>){
        try{
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, {
                ...todo,
                updateAt: Timestamp.now()
            });
        } catch (error){
            console.error('Error Update Todo:', error);
            throw error
        }
    },

    async deleteTodo(id:string){
        try {
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await deleteDoc(docRef);
        } catch (error){
            console.error('Error Delete Todo', error);
            throw error
        }
    },

    async updateStatus(id: string, status: boolean){
        try{
            const todoRef = this.getTodoRef();
            const docRef = doc(todoRef, id);
            await updateDoc(docRef, {status: status, updatedAt: Timestamp.now()});
        } catch (error){
            console.error('Error Update Status', error);
            throw error
        }
    }
}