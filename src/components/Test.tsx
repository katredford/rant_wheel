import { useWheel} from "./context/useWheel"

export default function Test() {
    const wheel = useWheel()
    console.log("HELLO HELLO HELLO",wheel)
    return(
        <>
        TESTING TESTING TESTING
        </>
    )
}