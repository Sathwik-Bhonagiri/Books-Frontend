import {  Children, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

const AuthContex = createContext();
export const useAuth = ()=>{
    return useContext(AuthContex)
}
const googleProvider = new GoogleAuthProvider();

// Authprovider 
export const AuthProvider = ({children})=>{

    const[currentUser,setCurrentUser]=useState(null);
    const[loading,setLoading]=useState(true);

    //register
    const registerUser=async(email,password)=>{
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    // login user 
    const loginUser = async (email,password)=>{
        return await signInWithEmailAndPassword(auth,email,password)
    }
    const signInWithGoogle = async()=>{
        return await signInWithPopup(auth, googleProvider)
    }

    const logout = () =>{
        return signOut(auth)
    }

    // manage user 
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
            setLoading(false);
            if(user){
                const{email,displayName,photoURL}=user;
                const userData = {
                    email,
                    username:displayName,
                    photo:photoURL
                }
            }
        })
        return ()=>unsubscribe();
    },[])

    const value ={
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    } 
    return (
        <AuthContex.Provider value={value}>
            {children}
        </AuthContex.Provider>
    )
}