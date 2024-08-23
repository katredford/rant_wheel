
import { useState, useEffect, useRef } from 'react';
import { useWheel } from '../context/useWheel'
import { toast } from 'react-hot-toast'
import { Input } from '../Input'

interface AddValueFormProps {
    wheel_id: string;

}

const AddValueForm: React.FC<AddValueFormProps> = ({ wheel_id }) => {
    const { addValue } = useWheel();
    const [inputValue, setInputValue] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (inputValue.trim() !== '') {
            addValue(wheel_id, inputValue)
            // onValueAdded()
            setInputValue('')
            
            toast.success('Value added')
        } else {
            toast.error('Value field cannot be empty')
        }
       
    }

    return (
        <>

            <form onSubmit={handleSubmit}>
                <div className="flex items-center w-full max-w-lg gap-2 p-5 m-auto">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        type="text"
                        className="w-full px-5 py-2 bg-transparent border-2 outline-none border-zinc-600 rounded-xl placeholder:text-zinc-500 focus:border-white"
                        placeholder="add a wheel value ..."
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 text-sm font-normal text-blue-300 bg-blue-900 border-2 border-blue-900 active:scale-95 rounded-xl"
                    >
                        add value
                    </button>
                </div>
            </form>

        </>
    )
}

export default AddValueForm