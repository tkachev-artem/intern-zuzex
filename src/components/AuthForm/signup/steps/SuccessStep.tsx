import { Form } from "@/components/Form/Form"

type InputField_Config = {
    label: string
    variant: 'outline' | 'subtle' | 'flushed' | undefined
    placeholder: string
    size: 'xs' | 'sm' | 'md' | 'lg'
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string | null
    status: 'error' | 'success' | 'warning' | 'info'
    error_title: string
}

type SuccessStepProps = {
    button_action: (e: React.MouseEvent<HTMLButtonElement>) => void
    button_text: string
}

export const SuccessStep = ({ button_action, button_text }: SuccessStepProps) => {
    const input_fields: InputField_Config[] = [] // Пустой массив для последнего шага

    return (
        <Form 
            title="Регистрация завершена!" 
            input_fields={input_fields}
            button_action={button_action}
            button_text={button_text}
        />
    )
}