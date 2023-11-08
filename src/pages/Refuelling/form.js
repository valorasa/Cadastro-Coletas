import { useState, useEffect } from "react";
import axiosInstance from "../../setup/axios";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../shared/components/NavigationBar";
import { Alert, Form, Row, Button } from "react-bootstrap";

const Refuelling = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();

    const [truckId, setTruckId] = useState();
    const [trucks, setTrucks] = useState([]);
    const [branch, setBranch] = useState([]);
    const [odometer, setOdometer] = useState([]);
    const [literskwsQuantity, setLiterskwsQuantity] = useState([]);
    const [literkwCost, setLiterkwCost] = useState([]);


    async function getTrucks() {
        setLoading(true);
        const response = await axiosInstance.get("/trucks");
        setTrucks(response.data);
        setLoading(false);
    }


    useEffect(() => {
        getTrucks();
    }, []);


    const handleTruckChange = (event) => {
        setTruckId(event.target.value);
    };

    const handleCityChange = (event) => {
        setBranch(event.target.value);
    };

    async function saveRefuelling() {
        setLoading(true);

        try {
            const requestBodyRefuelling = {
                truckId: truckId,
                city: branch,
                literskwsQuantity: literskwsQuantity,
                literkwCost: literkwCost,
                odometer: odometer,
            };

            await axiosInstance.post("/trucks-refuelling/save", requestBodyRefuelling);
            
            setBranch("")
            setTrucks("")
            setTruckId("")
            setOdometer(0)
            setLiterkwCost(0)
            setLiterskwsQuantity(0)

            navigate("./", { replace: true });
        } catch (err) {


            setAlert({
                success: false,
                message: err.message,
            });

        }

        setLoading(false);
    }

    return (
        <>
            <NavigationBar />

            <main className="container">
                {!!alert ? (
                    <Alert
                        variant={alert.success ? "success" : "danger"}
                        className="my-3"
                        dismissible
                        onClose={() => setAlert()}
                    >
                        {alert.message}
                    </Alert>
                ) : null}
                <div className="d-flex justify-content-between my-3">
                    <h1>Abastecimento</h1>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary mx-auto" role="status" />
                ) : (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Caminhão</Form.Label>
                            <Form.Select value={truckId} onChange={handleTruckChange}>
                                <option value="">Selecione o caminhão</option>
                                {trucks.length === 0 ? (
                                    <option>Carregando</option>
                                ) : (
                                    trucks.map((e, key) => (
                                        <option value={e.id} key={key}>
                                            {e.plate}
                                        </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Label>Selecione uma cidade:</Form.Label>
                        <Form.Select value={branch} onChange={handleCityChange}>
                            <option value="">Selecione a cidade</option>
                            <option value="SP">SP</option>
                            <option value="BH">BH</option>
                        </Form.Select>
                        <Form.Group className="mb-3 ">
                            <Form.Label>Quantidade Abastecida em Litros:</Form.Label>
                            <Form.Control
                                placeholder="Quantidade"
                                value={literskwsQuantity}
                                onChange={(event) => setLiterskwsQuantity(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 ">
                            <Form.Label>Custo do Abastecimento:</Form.Label>
                            <Form.Control
                                placeholder="Valor"
                                value={literkwCost}
                                onChange={(event) => setLiterkwCost(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 ">
                            <Form.Label>Odometro:</Form.Label>
                            <Form.Control
                                placeholder="Valor"
                                value={odometer}
                                onChange={(event) => setOdometer(event.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Button
                                style={{ backgroundColor: "#35a854" }}
                                className="border-0"
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveRefuelling();
                                }}
                            >
                                Salvar
                            </Button>
                        </Row>

                    </Form>
                )}
            </main>
        </>
    );
};

export default Refuelling;
