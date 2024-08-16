'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, updateDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [flashcardToDelete, setFlashcardToDelete] = useState(null);

    useEffect(() => {
        async function getFlashcards() {
            if (!user) {
                return;
            } else {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                }
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded && !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleClickOpen = (name) => {
        setFlashcardToDelete(name);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFlashcardToDelete(null);
    };

    const handleDelete = async (name) => {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const flashcardCollectionRef = collection(userDocRef, name);
        const flashcardDocs = await getDocs(flashcardCollectionRef);
    
        const deletePromises = flashcardDocs.docs.map((flashcardDoc) => deleteDoc(flashcardDoc.ref));
        await Promise.all(deletePromises);
    
        const updatedFlashcards = flashcards.filter(flashcard => flashcard.name !== name);
        setFlashcards(updatedFlashcards);
    
        await updateDoc(userDocRef, {
            flashcards: updatedFlashcards,
        });
    };

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <IconButton onClick={() => handleClickOpen(flashcard.name)} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>Do you really want to delete this flashcard?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button 
                        onClick={async () => {
                            await handleDelete(flashcardToDelete);
                            handleClose();
                        }} 
                        color="primary"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

