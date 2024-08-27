interface ICardProps {
  name: string
  isFull: boolean
}
import './Card.css'
export const Card = ({ name, isFull }: ICardProps) => {
  return (
    <div className={`card ${isFull ? 'card-full' : 'card-empty'}`}>
      <h1 className='card-title'>{name}</h1>
    </div>
  )
}
