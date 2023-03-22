import React, { useState, useEffect } from "react";
import axiosInstance from "../../setup/axios";
import { Form, Table, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash, FiPlus } from "react-icons/fi";
import NavigationBar from "../../shared/components/NavigationBar";

const PickUpsPage = () => {
  const [condominiums, setCondominiums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickUps, setPickUps] = useState([]);
  const [condominiumId, setCondominiumId] = useState(1);
  const [typeWastes, setTypeWastes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  async function getCondominiums() {
    const response = await axiosInstance.get("/condominiums");
    const data = response.data;
    setCondominiums(data.filter((item) => item.active === 1));
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
  }, []);
  async function getPickUps() {
    setLoading(true);
    const response = await axiosInstance.get("/pickups");
    const data = response.data;
    const result = data.filter((e) => e.condominiumId === condominiumId);

    const sorted = result.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setPickUps(sorted);
    setLoading(false);
  }
  useEffect(() => {
    getPickUps();
  }, [condominiumId]);

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

  return (
    <>
      <NavigationBar />
      <main className="container">
        <div className="d-flex justify-content-between my-3">
          <h1> Coletas</h1>
          <Link to="new">
            <Button>
              Adicionar <FiPlus />
            </Button>
          </Link>
        </div>
        <Form.Select
          className="mb-3"
          onChange={(event) => setCondominiumId(event.target.value)}
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
        {loading ? (
          <div className="spinner-border text-primary mx-auto" role="status" />
        ) : pickUps.length === 0 ? (
          <p>Não há coletas registradas neste condomínio</p>
        ) : (
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso</th>
                <th>Tipo de resíduo</th>
                <th>Caminhão</th>
                <th>Observações</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pickUps.map((e, index) => (
                <tr key={index}>
                  <td>{dateFormat(e.createdAt)}</td>
                  <td>{e.weight}</td>
                  <td>{findTypeWasteName(e.typeId)}</td>
                  <td>{findTruckName(e.truckId)}</td>
                  <td>{e.obs}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </main>
    </>
  );
};

export default PickUpsPage;
