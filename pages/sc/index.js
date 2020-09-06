import { Container, Dropdown, Table, ToggleButtonGroup, ToggleButton, Button, Form, Col, Modal } from 'react-bootstrap'
import { useState } from 'react'

import { Lists } from '../../data'

export default function Sc() {
    const [is, setIs] = useState('rsmev')
    const [type, setType] = useState('smev3')
    const [env, setEnv] = useState('prod')
    const [report, setReport] = useState(null)

    const [modal, setModal] = useState(false)
    const modalOpen = () => setModal(true)
    const modalClose = () => setModal(false)

    let formData = {}

    const reportHandler = async () => {
        window.open(`/api/reports?is=${is}&type=${type}&env=${env}&report=${report}&formdata=${JSON.stringify(formData)}`)
    }

    const typeHandler = (val) => {
        setType(val)
        setReport(null)
    }

    const formHandler = (e) => {
        formData[e.target.name] = e.target.value
    }

    function Menu() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <Dropdown
                    onSelect={setIs}
                >
                    <Dropdown.Toggle>
                        {Lists.isystem[is].name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {Object.entries(Lists.isystem).map((key) => (
                            <Dropdown.Item key={key[0]} eventKey={key[0]}>{key[1].name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <ToggleButtonGroup type="radio" name="options" value={type} onChange={typeHandler} style={{ marginLeft: '60px' }}>
                    <ToggleButton value="esia">ЕСИА</ToggleButton>
                    <ToggleButton value="smev2">СМЭВ 2</ToggleButton>
                    <ToggleButton value="smev3">СМЭВ 3</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup type="radio" name="options" value={env} onChange={setEnv} style={{ marginLeft: '60px' }}>
                    <ToggleButton value="test">Тестовый</ToggleButton>
                    <ToggleButton value="prod">Продуктивный</ToggleButton>
                </ToggleButtonGroup>
                <Button onClick={modalOpen} style={{ marginLeft: '60px' }}>Генератор заявок</Button>
            </div>
        )
    }

    function MemberInfo() {
        return (
            <>
                <Table size="sm">
                    <thead >
                        <tr>
                            <th>Полное наименование</th>
                            <th>Краткое наименование</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Lists.member[Lists.isystem[is].member].fullname}</td>
                            <td>{Lists.member[Lists.isystem[is].member].shortname}</td>
                        </tr>
                    </tbody>
                </Table>
            </>
        )
    }

    function IsInfo() {
        return (
            <>
                <Table>
                    <thead>
                        <tr>
                            <th>Полное наименование</th>
                            <th>Краткое наименование</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Lists.isystem[is][type].fullname}</td>
                            <td>{Lists.isystem[is][type].shortname}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th>Ключ</th>
                            <th>Мнемоника</th>
                            <th>Срок</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Lists.isystem[is][type][env].cert}</td>
                            <td>{Lists.isystem[is][type][env].code}</td>
                            <td>{Lists.isystem[is][type][env].date}</td>
                        </tr>
                    </tbody>
                </Table >
            </>
        )
    }

    function CheckField({ name, as = "input", placeholder, defaultValue, list }) {
        if (as == 'select') {
            formData[defaultValue] = Object.keys(list)[0]
            return (
                <Form.Control
                    name={name}
                    as={as}
                    onChange={formHandler}
                    required
                >
                    {Object.entries(list).map((key) =>
                        (
                            <option value={key[0]}>{`${key[1].surname} ${key[1].name.charAt(0)}.${key[1].patronymic.charAt(0)}.`}</option>
                        )
                    )}
                </Form.Control>
            )
        }
        else {
            return (
                <Form.Control
                    name={name}
                    as={as}
                    placeholder={placeholder}
                    onChange={formHandler}
                    required
                    defaultValue={Lists.isystem[is][type][defaultValue]}
                />
            )
        }
    }

    function FormReport() {
        if (report) {
            return (
                <Form>
                    {Object.entries(Lists.report[type][report].fields).map((row) => (
                        <Form.Row>
                            {Object.entries(row[1]).map((field) => (
                                <Form.Group as={Col}>
                                    <Form.Label>{field[1].name}</Form.Label>
                                    <CheckField name={field[0]} as={field[1].as} placeholder={field[1].placeholder} defaultValue={field[0]} list={Lists[field[1].list]} />
                                </Form.Group>
                            ))}
                        </Form.Row>
                    ))}
                </Form>
            )
        }
        else {
            return ''
        }

    }

    function ModalForm() {
        return (
            <Modal
                show={modal}
                size="lg"
                onHide={modalClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Генератор заявок
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown
                        onSelect={setReport}
                    >
                        <Dropdown.Toggle
                            style={{ padding: '10px', marginBottom: '10px', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                        >
                            {report == null
                                ? 'Выберите операцию'
                                : Lists.report[type][report].name
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.entries(Lists.report[type]).map((key) => (
                                <>
                                    <Dropdown.Item
                                        style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        key={key[0]}
                                        eventKey={key[0]}
                                    >
                                        {key[1].name}
                                    </Dropdown.Item>
                                </>
                            ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <FormReport />
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary" onClick={modalClose}> */}
                    <Button variant="primary" onClick={reportHandler}>
                        Сгенерировать
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <>
            <Container style={{ borderRadius: '10px', background: '#fff', marginTop: '10px', padding: '10px' }}>
                <Menu />
            </Container>
            <Container style={{ borderRadius: '10px', background: '#fff', marginTop: '10px', padding: '10px' }}>
                <h3 align="center">Информация об участнике</h3>
            </Container>
            <Container style={{ borderRadius: '10px', background: '#fff', marginTop: '10px', padding: '10px' }}>
                <MemberInfo />
            </Container>
            <Container style={{ borderRadius: '10px', background: '#fff', marginTop: '10px', padding: '10px' }}>
                <h3 align="center">Информация об ИС</h3>
            </Container>
            <Container style={{ borderRadius: '10px', background: '#fff', marginTop: '10px', padding: '10px' }}>
                <IsInfo />
            </Container>
            <ModalForm />
        </>
    )
}