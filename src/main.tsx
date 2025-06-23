import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { SuiProvider, defaultSystem } from "@saas-ui/react"
import { store } from "./app/store"
import { App } from "./App"
import "./index.css"

// Инициализация localStorage с тестовыми пользователями
import { initializeDefaultUsers } from "./middleware"

// Инициализируем localStorage при запуске приложения
initializeDefaultUsers()

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <ReduxProvider store={store}>
        <SuiProvider value={defaultSystem}>
          <App />
        </SuiProvider>
      </ReduxProvider>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
