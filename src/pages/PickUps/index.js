import React, { useState, useEffect } from "react";
import axiosInstance from "../../setup/axios";
import { Form, Table, Button, ButtonGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash, FiPlus } from "react-icons/fi";
import NavigationBar from "../../shared/components/NavigationBar";
import styles from "../../style/form.module.css"
import Select from 'react-select';
import { useParams } from "react-router-dom";

const PickUpsPage = () => {
  const params = useParams();
  const [collectPoint, setcollectPoint] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickUps, setPickUps] = useState([]);
  const [collectPointId, setcollectPointId] = useState(1 || "1");
  const [typeWastes, setTypeWastes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [searchText, setSearchText] = useState('');
  async function getcollectPoint() {
    const response = await axiosInstance.get("/collect-point/find");
    const data = response.data;
    setcollectPoint(data.filter((item) => item.active === 1 || "1"));
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
    getcollectPoint();
    getTypeWastes();
    getTrucks();
  }, []);
  async function getPickUps() {
    setLoading(true);
    const response = await axiosInstance.get("/pickups");
    const data = response.data;
    const result = data.filter((e) => String(e.collectPointId) === String(collectPointId));

    const sorted = result.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setPickUps(sorted);
    setLoading(false);
  }
  useEffect(() => {
    getPickUps();
  }, [collectPointId]);

  function dateFormat(date) {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString();
  }

  async function handleDelete(index, id) {
    setPickUps(pickUps.filter((v, i) => i !== index));
    await axiosInstance.delete(`/pickups/${id}`);
  }

  function findTypeWasteName(id) {
    const result = typeWastes.find((i) => i.id === id);
    if (!!result) {
      return result.name;
    }
  }
  function findTruckName(id) {
    const result = trucks.find((i) => i.id === id);
    if (!!result) {
      return result.plate;
    }
  }

  const filteredcollectPoint = collectPoint.filter(collectPoint => {
    return collectPoint.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const options = filteredcollectPoint.map(collectPoint => ({
    value: collectPoint.id,
    label: collectPoint.name
  }));
 
  function dateFormat(date) {
    const isoDate = new Date(date).toISOString();
    const adjustedDate = new Date(new Date(isoDate).getTime() - 3 * 60 * 60 * 1000);
    return adjustedDate.toLocaleString();
  }
  
  return (
    <>
      <NavigationBar />
      {/* <main className="container"> */}
        <Container>
        <div className="d-flex justify-content-between my-3">
          <h1> </h1>
          <Link to="new">
            <Button style={{backgroundColor: "#35a854"}}
           // variant="success"
           className="border-0"
            >
              Adicionar <FiPlus />
            </Button>
          </Link>
        </div>
        <Form.Group className="mb-3">
                <Form.Label>Ponto de Coleta</Form.Label>
                <Select
                  className={styles.customSelect}
                  options={options}
                  onChange={(selectedOption) => setcollectPointId(selectedOption.value)}
                  placeholder="Escolha o ponto de coleta"
                  isDisabled={!!params.id}
                  onInputChange={(value) => setSearchText(value)}
                  inputValue={searchText}
                />
              </Form.Group>
        {loading ? (
          <div className="spinner-border text-primary mx-auto" role="status" />
        ) : pickUps.length === 0 ? (
          <p>Não há coletas registradas neste condomínio</p>
        ) : (
          <Table striped bordered hover responsive className="mb-3">
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso</th>
                <th>Peso Ajustado</th>
                <th className="d-none d-sm-table-cell">Tipo de resíduo</th>
                <th>Caminhão</th>
                <th className="d-none d-sm-table-cell">Observações</th>
                {/* <th>Ações</th> */}
              </tr>
            </thead>
            <tbody>
              {pickUps.map((e, index) => (
                <tr key={index}>
                  <td>{dateFormat(e.createdAt)}</td>
                  <td>{e.weight}</td>
                  <td>{e.adjustedWeight}</td>
                  <td className="d-none d-sm-table-cell">{findTypeWasteName(e.typeId)}</td>
                  <td>{findTruckName(e.truckId)}</td>
                  <td className="d-none d-sm-table-cell">{e.obs}</td>
                  {/* <td>
                    <ButtonGroup className="d-flex justify-content-evenly">
                      <Link to={`edit/${e.id}`}>
                        <Button className="mx-1">
                          <FiEdit2 />
                        </Button>
                      </Link>
                      <Link to="#">
                        <Button
                          className="mx-1"
                          onClick={(event) => handleDelete(index, e.id)}
                        >
                          <FiTrash />
                        </Button>
                      </Link>
                    </ButtonGroup>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      {/* </main> */}
      </Container>
    </>
  );
};

export default PickUpsPage;
