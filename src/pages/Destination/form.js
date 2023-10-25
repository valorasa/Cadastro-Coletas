import { useState, useEffect } from "react";
import axiosInstance from "../../setup/axios";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../shared/components/NavigationBar";
import { Alert, Form, Row, Button } from "react-bootstrap";
import moment from 'moment';
import styles from '../../style/form.module.css';

const Destination = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState();

    const [truckId, setTruckId] = useState();
    const [trucks, setTrucks] = useState([]);

    const [collectsTruck, setCollectsTruck] = useState([]);
    const [selectedWeightSum, setSelectedWeightSum] = useState(0);
    const [weight, setWeight] = useState()

    const [discardPlaceId, setDisardPlaceId] = useState();
    const [discardPlace, setDisardPlace] = useState([]);

    const [pickups, setPickups] = useState([]);
    const [formValidated, setFormValidated] = useState(false);
    const [atLeastOneChecked, setAtLeastOneChecked] = useState(false);
  

    const [date, setDate] = useState();

    const [requestBodyToShow, setRequestBodyToShow] = useState(null);
  

    async function getTrucks() {
        setLoading(true);
        const response = await axiosInstance.get("/trucks");
        setTrucks(response.data);
        setLoading(false);
    }

    async function getCollectsTruck() {
        if (truckId) {
            const response = await axiosInstance.post(`/pickups/pending-by-truck-id?truckId=${truckId}`);
            const data = response.data;
           
            setCollectsTruck(data);
        }
    }

    async function findDiscardPlace() {
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/discardplace`);
            const data = response.data;
            setDisardPlace(data.map(item => ({ id: item.id, name: item.name })));
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => {
         // Ask for location permission when the component is mounted
         if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Handle successful permission here
                    console.log("Location permission granted:", position);
                    // You can use the latitude and longitude from `position` object
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        console.log("Permissão de localização negada pelo usuário");
                        window.alert("Você tem que permitir acesso a sua localização")
                    } else {
                        console.log("Erro ao obter a localização:", error.message);
                    }
                }
            );
        } else {
            console.log("Geolocation not available");
        }
        getTrucks();
    }, []);

    useEffect(() => {
        if (truckId) {
            getCollectsTruck();
        }
        findDiscardPlace();
    }, [truckId]);

    const handleTruckChange = (event) => {
        setTruckId(event.target.value);
        setSelectedWeightSum(0);
      };

    const handleCheckboxChange = (event) => {
        const collectId = event.target.id.split("-")[1];

        if (event.target.checked) {
            setPickups([...pickups, collectId])
        } else {
            setPickups(pickups.filter((id) => id !== collectId));
        }

        const isChecked = event.target.checked;
        const itemWeight = parseFloat(event.target.value);;
        const currentWeightSum = parseFloat(selectedWeightSum);
        setSelectedWeightSum(
            isChecked ? currentWeightSum + itemWeight : currentWeightSum - itemWeight
        );
    };

    const validateForm = () => {
        const requiredFields = [truckId, discardPlaceId, weight, date];
        const isFormValid = requiredFields.every((field) => field !== undefined && field !== "" && field.date !== "dd/mm/aaaa");
        setFormValidated(isFormValid);
      };

      const validateCheckbox = () => {
        setAtLeastOneChecked(pickups.length > 0);
      };

      useEffect(() => {
        validateCheckbox();
      }, [pickups]);

      useEffect(() => {
        validateForm();
      }, [truckId, discardPlaceId, weight]);

    async function savePickUp() {
        setLoading(true);

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const latitude = position.coords.latitude.toString();
            const longitude = position.coords.longitude.toString();

            // const factor = weight / selectedWeightSum;

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
            
            const selectedDate = moment(date, 'YYYY-MM-DD').toDate(); // 'date' é o valor fornecido pelo usuário

            selectedDate.setHours(currentDate.getHours() - 3); // Subtrai 3 horas para ajustar ao fuso horário de Brasilia 
            selectedDate.setMinutes(currentDate.getMinutes());
            selectedDate.setSeconds(currentDate.getSeconds());

            const formattedDateTime = selectedDate.toISOString().replace('T', ' ').slice(0, 19);

            if(!latitude || latitude == '') {
                setAlert({
                    success: true,
                    message: "Sem endereço",
                });
            }
           // setRequestBodyToShow(requestBody);
            const requestBody = {
                weight:  weight? weight.toString().replace(",", "."): null,
                latitude: latitude,
                longitude: longitude,
                discardplaceId: discardPlaceId,
                discartedAt: formattedDateTime,//formattedDate,
                //  factor,
                pickups: pickups
            };

            const response = await axiosInstance.post("routes/discard", requestBody);
           
            if(response.data.status == false){
                setAlert({
                    success: false,
                    message: response.data.message,
                });
            }
          
            // setAlert({
            //     success: true,
            //     message: "salvo",
            // });
 
            setTruckId("");
            setCollectsTruck([]);
            setSelectedWeightSum(0);
            setWeight("");
            setDisardPlaceId("");
            setPickups([]);

            setTimeout(() => {
                setAlert(null); 
              }, 5000);

            navigate("./", { replace: true });
        } catch (err) {
            if (err.code === 1) { // erro de permissão negada
            setAlert({
                success: false,
                message: "Para continuar, permita o acesso à sua localização.",
            });

            }
            console.log(err)
            // let errorMessage = "Erro de validação dos dados, confirme as entradas.";

            // // Adicione mensagens de erro específicas para campos que falharam na validação
            // if (!truckId || truckId === "") {
            //     errorMessage += "\n- O campo 'Caminhão' é obrigatório.";
            // }
    
            // if (!discardPlaceId || discardPlaceId === "") {
            //     errorMessage += "\n- O campo 'Local de destinação' é obrigatório.";
            // }
    
            // if (!weight || weight === "") {
            //     errorMessage += "\n- O campo 'Pesagem' é obrigatório.";
            // }

          
            setAlert({
                success: false,
                message:err.message,
            });

            setTruckId("");
            setCollectsTruck([]);
            setSelectedWeightSum(0);
            setWeight("");
            setDisardPlaceId("");
            setPickups([]);

            setTimeout(() => {
                setAlert(null); 
              }, 5000);


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
                    <h1>Destino</h1>
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
                            {!!truckId && collectsTruck.length > 0 ? (
                                <Form.Group>
                                    <Form.Label>Condomínios</Form.Label>
                                    {collectsTruck.map((collect) => (
                                        <div key={collect.id}>
                                            <Form.Check
                                                type="checkbox"
                                                label={`${collect.condominium.name || "Nome não disponível"} - Peso: ${collect.weight} ${collect.type.name}`}
                                                id={`collect-${collect.id}`}
                                                value={collect.weight}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    ))}
                                </Form.Group>
                            ) : null}
                            <Form.Group>
                                <Form.Label>Peso Total:</Form.Label>
                                <Form.Control type="text" value={selectedWeightSum} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3 ">
                                <Form.Label>Pesagem</Form.Label>
                                <Form.Control
                                    placeholder="Peso real"
                                    value={weight}
                                    onChange={(event) => setWeight(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 ">
                                <Form.Label>Data</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Data"
                                    defaultValue={date}
                                    onChange={(event) => setDate(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Locais de destinação</Form.Label>
                                <Form.Select
                                    onChange={(event) => setDisardPlaceId(event.target.value)}
                                defaultValue={discardPlaceId}
                                value={discardPlaceId}
                                disabled={!!params.id ? true : false}
                            >
                                 <option value="">Local de destinação</option>
                                {discardPlace.length === 0 ? (
                                    <option>Carregando</option>
                                ) : (
                                    discardPlace.map((e, key) => (
                                        <option value={e.id} key={key}>
                                            {e.name}
                                        </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>

                            <Row>
                                <Button
                                    style={{ backgroundColor: "#35a854" }}
                                    className="border-0"
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        savePickUp();
                                    }}
                                  //  disabled={!formValidated || !atLeastOneChecked}
                                >
                                    Salvar
                                </Button>
                            </Row>
                            {/* <div>
                                {requestBodyToShow && (
                                    <pre>{JSON.stringify(requestBodyToShow, null, 2)}</pre>
                                )}
                            </div> */}

                        </Form>
                )}
            </main>
        </>
    );
};

export default Destination;
