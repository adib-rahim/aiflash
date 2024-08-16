'use client'
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Head from "next/head";



export default function Home() {

  const handlePro = async () => {
    const checkoutSession = await fetch ('api/checkout_pro', {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000'
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    
    if(error){
      console.warn(error.message)
    }
  }

  const handleBasic = async () => {
    const checkoutSession = await fetch ('api/checkout_basic', {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000'
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    
    if(error){
      console.warn(error.message)
    }
  }

  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/generate')
  }

  
  const handleMyFlashcards = () => {
    router.push('/flashcards')
  }




  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard Saas</title>
        <meta name = "description" content = "Create flashcard from your text" />
      </Head>

      <AppBar position = "static" sx={{ 
          borderBottomLeftRadius: 16, 
          borderBottomRightRadius: 16, 
          overflow: 'hidden' 
        }}>
        <Toolbar>
          <Typography variant="h6" style = {{flexGrow: 1}}>Flashcard Saas</Typography>
          <SignedIn>
            <UserButton sx={{ mt: 2, ml: 2 }}/>
          </SignedIn>
          <SignedOut>
            <Button color="inherit" href = "/sign-in">Login</Button>
            <Button color="inherit" href = "/sign-up">Create Account</Button>
          </SignedOut>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign: 'center',
        my: 4,
      }}>
        <Typography variant="h2" gutterBottom>Welcome to Flashcard Saas</Typography>
        <Typography variant="h5" gutterBottom>The easiest way to make flashcards from your text</Typography>
        <SignedIn>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleGetStarted}>Generate</Button>
          <Button variant="contained" color="primary" sx={{ mt: 2, ml: 2 }} onClick={handleMyFlashcards}>My Sets</Button>
        </SignedIn>
        <SignedOut>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/sign-up">Get Started</Button>
        </SignedOut>
      </Box>
      <Box sx={{my: 6}} textAlign={'center'}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing = {4}>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Easy Flashcard Generation</Typography>
            <Typography>{' '}
              Simply paste your text and our AI will generate flashcards for you. No need to spend hours creating them yourself.
              </Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Smart Flashcards</Typography>
            <Typography>{' '}
              Our AI will generate consice flashcards for you, so you can focus on studying the most efficient way.
              </Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Accesible Anywhere</Typography>
            <Typography>{' '}
              Access your flashcards from anywhere, on any device, at any time. Study one the go!
              </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing = {4}>
          <Grid item xs = {12} md = {6}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant = "h5" gutterBottom>Basic</Typography>
              <Typography variant = "h6" gutterBottom>$5 / month</Typography>
              <Typography>{' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleBasic}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs = {12} md = {6}>
          <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant = "h5" gutterBottom>Pro</Typography>
              <Typography variant = "h6" gutterBottom>$10 / month</Typography>
              <Typography>{' '}
                Unlimited flashcards and storage with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handlePro}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Container>
  )
}
