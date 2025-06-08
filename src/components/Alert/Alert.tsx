import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

type AlertProps = {
    title: string;
}

export const AlertDisplay = ({ title }: AlertProps) => {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{title}</AlertDescription>
        </Alert>
    )
}