import { Button } from 'react-bootstrap'
import { useState } from 'react'

export default function Esed() {
    const [genState, setGenState] = useState(false)

    const genHandler = async () => {
        setGenState(true)
        const file = await (await fetch('/api/esed/generator')).json()
        setGenState(false)
        window.open(`/reports/esed/${file.name}`, '_self')
    }

    const download = () => {
        window.open(`/templates/esed/main.xlsx`)
    }

    return (
        <>
            <Button onClick={genHandler} style={{ marginLeft: '60px' }} disabled={genState}>Сгенерировать отчёт</Button>
            <Button onClick={download} style={{ marginLeft: '60px' }}>Получить текущий шаблон</Button>
        </>
    )
}