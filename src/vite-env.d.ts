/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEPOLIA_RPC_URL: string
  readonly VITE_PRIVATE_KEY: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_REPUTATION_CONTRACT_ADDRESS: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}