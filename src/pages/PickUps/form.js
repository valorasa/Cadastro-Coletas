import { useState, useEffect } from "react";
import axiosInstance from "../../setup/axios";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../shared/components/NavigationBar";
import { Alert, Form, Button, Row } from "react-bootstrap";
import jwtDecode from 'jwt-decode';

const PickUpForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState();

  const [date, setDate] = useState();
  const [weight, setWeight] = useState();
  const [obs, setObs] = useState();
  const [bagType, setBagType] = useState();
  const [numBags, setNumBags] = useState(0);

  const [truckId, setTruckId] = useState();
  const [trucks, setTrucks] = useState([]);

  const [condominiumId, setCondominiumId] = useState();
  const [condominiums, setCondominiums] = useState([]);

  const [typeWasteId, setTypeWasteId] = useState();
  const [typeWastes, setTypeWastes] = useState([]);

  const [discardPlaceId, setDisardPlaceId] = useState();
  const [discardPlace, setDisardPlace] = useState([]);


  async function findPickUp() {
    setCondominiumId(condominiums[0].id);
    setTruckId(trucks[0].id);
    setTypeWasteId(typeWastes[0].id);
    setDisardPlaceId(discardPlace[0].id)

    if (!!params.id) {
      setLoading(true);
      const response = await axiosInstance.get(`/pickups/${params.id}`);
      const data = response.data;
      setDate(data.createdAt.split(" ")[0]);
      setWeight(data.weight);
      setObs(data.obs);
      setTruckId(data.truckId);
      setCondominiumId(data.condominiumId);
      setTypeWasteId(data.typeId);
      setLoading(false);
    }
  }


  
  async function getCondominiums() {
    const response = await axiosInstance.get("/condominiums");
    const data = response.data;
    setCondominiums(data.filter((item) => item.active === 1));
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
  
  async function getTypeWastes() {
    setLoading(true);
    const response = await axiosInstance.get("/typewaste");

    setTypeWastes(response.data);
    setLoading(false);
  }
  async function getTrucks() {
    setLoading(true);
    const response = await axiosInstance.get("/trucks");

    setTrucks(response.data);
    setLoading(false);
  }

  
  useEffect(() => {
    getCondominiums();
    getTypeWastes();
    getTrucks();
    findDiscardPlace();
  }, []);

  useEffect(() => {
    if (condominiums.length > 0 && typeWastes.length > 0 && trucks.length > 0 && discardPlace.length > 0) {
      findPickUp();
    }
  }, [condominiums, typeWastes, trucks]);

  const bagWeights = { // Objeto que mapeia o tipo de bag para o peso correspondente
    "Bag A": 16,
    "Bag B": 35,
    "Bag C": 70,
    "Bag D": 50,
    "Bag E": 1 // peso de 1kg para Bag D
  };



  const accessToken = sessionStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.sub;


  const handleBagSelection = (event) => {
    setBagType(event.target.value);
    setWeight(numBags * bagWeights[event.target.value]);
  };
  async function savePickUp() {
    setLoading(true);
  
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const latitude = position.coords.latitude.toString();
      const longitude = position.coords.longitude.toString();

  
    
      const requestBody = {
        truckId,
        typeId: typeWasteId,
        condominiumId,
        weight: weight.toString().replace(",", "."),
        latitude: latitude,
        longitude: longitude,
        obs,
        createdAt: date,
        userId: userId,
        discardplaceId: null
      };
  
      !!params.id
        ? await axiosInstance.put(`pickups/${params.id}`, requestBody)
        : await axiosInstance.post("pickups/save", requestBody);
  
      setAlert({
        success: true,
        message: "Salvo com sucesso",
      });
  
      navigate("./", { replace: true });
    } catch (error) {
      console.error(error);
      setAlert({
        success: false,
        message: "Erro de validação dos dados, confirme as entradas",
      });
      
      if (error.code === 1) { // erro de permissão negada
        alert("Para continuar, permita o acesso à sua localização.");
      }
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
          <h1> {!!params.id ? "Editar coleta" : "Nova coleta"}</h1>
        </div>
        {loading ? (
          <div className="spinner-border text-primary mx-auto" role="status" />
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Condomínio</Form.Label>
              <Form.Select
                onChange={(event) => setCondominiumId(event.target.value)}
                defaultValue={condominiumId}
                value={condominiumId}
                disabled={!!params.id ? true : false}
              >
                {condominiums.length === 0 ? (
                  <option>Carregando</option>
                ) : (
                  condominiums.map((e, key) => (
                    <option value={e.id} key={key}>
                      {e.name}
                    </option>
                  ))
                )}
              </Form.Select>
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
              <Form.Label>Tipo de resíduo</Form.Label>
              <Form.Select
                onChange={(event) => {
                  setTypeWasteId(event.target.value);
                  setBagType("");
                }}

              >
                <option value="">Selecione o tipo de resíduo</option>
                {typeWastes.length === 0 ? (
                  <option>Carregando</option>
                ) : (
                  typeWastes.map((e, key) => (
                    <option value={e.id} key={key}>
                      {e.name}
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de bag</Form.Label>
              <Form.Select
                onChange={(event) => {
                  setBagType(event.target.value);
                  setNumBags();
                }}
                defaultValue={bagType}
                value={bagType}
              >
                <option value="">Escolha o tipo de bag</option>
                {typeWasteId === "1" || typeWasteId === "2" ? (
                  <option value="Bag D">Big bag (50kg)</option>
                ) : (
                  <>
                    <option value="Bag A">Sacos (16 a 18Kg)</option>
                    <option value="Bag B">Bombinhas (35kg)</option>
                    <option value="Bag C">Bombonas (70kg)</option>
                  </>
                )}
                <option value="Bag E">Kg</option>
              </Form.Select>
            </Form.Group>
            {bagType && bagType !== "Bag E" && ( // Renderizar a seção de quantidade de sacos apenas para os tipos de bag que não são "Bag D"
              <Form.Group className="mb-3 ">
                <Form.Label>Quantidade de sacos</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Quantidade"
                  value={numBags}
                  onChange={(event) => {
                    setNumBags(event.target.value);
                    setWeight(event.target.value * bagWeights[bagType]);
                  }}
                  required
                />
              </Form.Group>
            )}
            {bagType !== "Bag E" && (
              <Form.Group className="mb-3">
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Peso"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  required
                />
              </Form.Group>
            )}
            {bagType === "Bag E" && (
              <Form.Group className="mb-3">
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Peso"
                  value={weight}
                  onChange={(event) => {
                    setWeight(event.target.value);
                    setNumBags("");
                  }}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3 ">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                placeholder="Observações"
                defaultValue={obs}
                as="textarea"
                rows={3}
                onChange={(event) => setObs(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caminhão</Form.Label>
              <Form.Select
                onChange={(event) => setTruckId(event.target.value)}
                defaultValue={truckId}
                value={truckId}
              >
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
              <Row>
                <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  savePickUp();
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

export default PickUpForm;