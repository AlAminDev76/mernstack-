import { useEffect, useState } from "react";
import initializeAuthentication from "../firebase/firebase.init";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

initializeAuthentication();

const useFirebase = () => {

    const [user, setUser] = useState({});
    const [error, setError] = useState('');

    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    // -----------------------------------------
    // GOOGLE LOGIN
    // -----------------------------------------
    const google = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                setUser(result.user);
                navigate('/dashboard'); 
            })
            .catch(error => {
                setError(error.message);
            });
    };

    // -----------------------------------------
    // GITHUB LOGIN
    // -----------------------------------------
    const github = () => {
        signInWithPopup(auth, githubProvider)
            .then(result => {
                setUser(result.user);
                navigate('/dashboard');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    // -----------------------------------------
    // RESET PASSWORD
    // -----------------------------------------
    const resetPassword = (email) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Password reset email sent',
                    text: 'Check your email.',
                });
            });
    };

    
    const logOut = () => {
        signOut(auth)
            .then(() => {
                setUser({});
                navigate('/');
            });
    };

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
            } else {
                setUser({});
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // -----------------------------------------
    // RETURN VALUES
    // -----------------------------------------
    return {
        auth,
        user,
        setUser,
        error,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        google,
        github,
        sendEmailVerification,
        updateProfile,
        logOut,
        onAuthStateChanged,
        resetPassword
    };
};

export default useFirebase;
