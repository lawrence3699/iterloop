import { CopyButton } from '../ui/CopyButton'

interface InstallPillProps {
  command: string
}

export function InstallPill({ command }: InstallPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white/70 py-1.5 pl-5 pr-1.5 ring-1 ring-gray-200 backdrop-blur-md">
      <span className="select-none font-mono text-sm text-gray-400">$</span>
      <code className="flex-1 truncate font-mono text-sm text-gray-900">{command}</code>
      <CopyButton
        text={command}
        className="text-gray-500 hover:bg-gray-900/5 hover:text-gray-900"
      />
    </div>
  )
}
