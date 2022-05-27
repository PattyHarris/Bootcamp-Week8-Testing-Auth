# Testing Authentication and Sessions

Simple tutorial on testing authentication using NextAuth.js.  The app uses a simple email only authentication process.

1. As usually, install a next.js app:
```
npx create-next-app@latest --use-npm testing-auth
```

2. Add NextAuth.js and PostgreSQL libraries - prisma is installed a bit later in the tutorial (see below).  I installed it next since it will automatically add a .env file:
```
npm install next-auth pg @next-auth/prisma-adapter nodemailer
npm install -D prisma
npx --use-npm prisma init
```

3. Setup the new PostgreSQL database on railway - this one is called test-auth.

4. Add the 5 environment variables to .env:
```
DATABASE_URL: <THE DATABASE URL>
EMAIL_SERVER=smtp://user:pass@smtp.mailtrap.io:465
EMAIL_FROM=Your name <you@email.com>
NEXTAUTH_URL=http://localhost:3000
SECRET=<ENTER A UNIQUE STRING HERE>
```

Use https://generate-secret.vercel.app/32 to generate the secret.

5. For the email server, setup a fake email server and user using the https://mailtrap.io/ service.
You can only have one inbox at a time.  To see the credentials, click on 'show credentials'.  There, you copy the user name and password and then change the 'user' and 'pass' fields in the EMAIL_SERVER environment variable.  In the EMAIL_FROM variable, just replace 'Your name' with whatever.

6. NEXTAUTH_URL needs to be updated if it is deployed (e.g. to vercel).

7. Create a new folder 'auth' under 'api' and add the [...nextauth].js file.  Copy the contents from the lesson to the file, replacing the secret with the one generated for the .env file.  CORRECTION: instead of copying the secret, you can just use the env value:
```
jwt: {
    secret: process.env.SECRET,
    encryption: true,
  }
```

8. At this point, the prisma is installed and initialized (which I did above).  Add the NextAuth schema from the tutorial to the schema.prisma file.  Migrate the schema to the database:
```
npx --use-npm prisma migrate dev
```

9. Add the session component to _app.js.  We added a session component wrapper which is a way to pass the session data to the child components.  

10. Create the prisma client (as we did in Week 7) - /lib/prisma.js.

11. Add the same jsconfig.json file to provide absolute imports (as in Week 7).

12.  In index.js, import the 'userSession' hook from next-auth/react.  Setup the hook:
```
const { data: session, status } = useSession();
```
Add the code from the tutorial to show a message if the user is logged in.

```
{ session ? <p>You are logged in!</p> :
    <p>You are not logged in 😞. <a href='/api/auth/signin'>login</a></p>}
```

The above generated a warning about not use "Link" - so I changed it to this - note that the format of the 'Link' tag MUST be as shown - otherwise, you'll get various 'children' errors:
```
import Link from 'next/link'
....
{ session ? <p>You are logged in!</p> :
  <p>You are not logged in 😞.  
    <Link href='/api/auth/signin'><a>login</a></Link>
  </p>}

```

The link above brings up a basic email login form (provided by the mailtrap service).  Add your email and click the 'sign-in' button.  Then go to mailtrap and you'll see a message (on the left) - click that and the center console will show a "sign-in" button.   When you click that button (on mailtrap), there's a redirect back to http://localhost:3000 and now the page shows that we're logged in - you need to have mailtrap.io running in the same browser where you're running the app - the session cookies are stored there.


13. To add a logout button - see the final bit of code in index.js - but this is the start:
```
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
....

const router = useRouter();
...

{session && (
  <p>
    {session.user.email}{' '}
    <button
      className="underline"
      onClick={() => {
        signOut()
        router.push('/')
      }}
    >
      logout
    </button>
  </p>
)}
```

14. The page initially shows that we're not logged in and then shows that we are logged in.  This is because the page is rendered from the server but the logged in session cookie is on the client.  This can be fixed by checking the 'status' from the useSession hook.  It can be 'authenticated', 'loading', or 'unauthenticated'.
```
    if (status === 'loading' ) {
        return <p>... </p>
    }
```
