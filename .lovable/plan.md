Plan to get the prototype presentation-ready:

1. **Stop the app from blanking on normal auth/data failures**
   - Keep the root error boundary, but ensure authenticated pages render calm recovery states instead of falling through to “This page didn’t load”.
   - Make dashboard/workspace/assistant queries tolerate missing optional reference data where safe, while still showing retry buttons for real failures.

2. **Fix login and post-login routing**
   - Harden `/auth` so email/password and Google sign-in wait for a valid session before calling protected server functions.
   - If profile creation fails because auth is still settling, continue into the app and let the protected screens recover instead of trapping the user on a broken page.
   - Preserve redirect-back behavior so sign-in returns to the intended route.

3. **Verify the protected server-function auth path**
   - Confirm `attachSupabaseAuth` remains globally registered in `src/start.ts`.
   - Adjust any server-function calls that can run before auth is ready so they don’t fire without a bearer token.

4. **Repair demo flow reliability**
   - Ensure `/`, `/workspace`, `/assistant-loading`, `/assistant`, `/assistant-error`, and `/team` all load when signed in.
   - Keep “Seed demo data” and “Reset demo data” disabled while pending and invalidate dashboard/workspace/assistant queries after success.
   - Ensure the Acme golden path and Vertex empty-signals path work without manual database setup.

5. **Backend safety check**
   - Apply only targeted backend fixes if needed: grants, RLS helper function permissions, or trigger/profile safeguards.
   - Do not loosen RLS broadly or expose user data anonymously.

6. **Presentation QA**
   - Run a browser pass through sign-in, dashboard, seed demo data, workspace, assistant review, accept update, and manager/team screen.
   - Check console/network output for remaining runtime errors.
   - Finish only after the preview visibly loads and the golden path works.