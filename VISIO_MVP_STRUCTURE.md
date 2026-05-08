# Visio MVP Structure

## Mobile (Expo + React Native)

- `mobile/App.js` — Main navigation flow (Welcome → Upload → Outfit Selection → Loading → Results).
- `mobile/src/components/PrimaryButton.js` — Reusable CTA button.
- `mobile/src/services/api.js` — API layer with timeout + request error handling.
- `mobile/src/screens/WelcomeOnboardingScreen.js` — Landing screen.
- `mobile/src/screens/UserImageUploadScreen.js` — Camera/gallery upload entry UI.
- `mobile/src/screens/OutfitSelectionScreen.js` — Category selection + generation trigger.
- `mobile/src/screens/LoadingProcessingScreen.js` — Dynamic loading screen.
- `mobile/src/screens/TransformationResultsScreen.js` — Original vs AI look + save/share/retry actions.

## Backend (FastAPI)

- `backend/app/main.py` — FastAPI app with health endpoint and generation endpoint.
- `backend/requirements.txt` — Python dependencies.

### Run backend locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
