import { Dispatch,SetStateAction } from "react"
export default function Range({label, state, setState }:{label:string,state:[number,number],setState:Dispatch<SetStateAction<[number, number]>>}) {
    return <div className="border border-dashed border-gray-950 w-80 flex flex-row flex-nowrap justify-around">
        <label htmlFor="">{label}</label>
        <input className="w-10" type="number" name="" id="" defaultValue={state[0]} onChange={e=>{setState([Number(e.target.value), state[1]])}}/>
        <input className="w-10" type="number" name="" id="" defaultValue={state[1]} onChange={e=>{setState([state[0],Number(e.target.value)])}}/>
    </div>
}