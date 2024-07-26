import { Button, Input, Select, message } from "antd"
import RandomBG from "../components/RandomBG"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import { sanityClient } from "../lib/sanity/getClient";

const { Option } = Select;

function Biodata() {
  const navigate = useNavigate();
  const relawanApk_userData = JSON.parse(localStorage.getItem('relawanApk_userData'));
  const relawanApk_id = (localStorage.getItem('relawanApk_id'));
  console.log('cek id user: ', relawanApk_id)

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

  const [serverData, setServerData] = useState({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchSanityData() {
      try {
        const sanityData = await sanityClient.fetch(`*[_type == 'user']{
          _id,
          name,
          email,
          type,
          password,
          umur,
          gender,
          alamat,
          faskes,
          tb,
          bb,
          keluhan,
          telepon,
          resiko
        }`);

        // Filter the data array based on relawanApk_id
        const filteredData = sanityData.filter(item => item._id === relawanApk_id);

        setServerData({
          data: filteredData,
          error: null,
          loading: false,
        });
      } catch (error) {
        setServerData({
          data: [],
          error: 'Error getting data. Please try again later.',
          loading: false,
        });
      }
    }

    fetchSanityData();
  }, []);
  console.log('cek biodata: ', serverData)

  const updateSanityUser = async (relawanApk_userData) => {
    try {
      const response = await fetch(`https://ln9ujpru.api.sanity.io/v2021-03-25/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer skAdQo8vEzaH81Ah4n2X8QDNsgIfdWkJlLmbo3CbT6Nt3nW7iTLx2roYCOm9Rlp1mQV2nEEGCqf4aGSMaJx67iK5PZPe7CgmI9Lx9diRdq0ssoRzl1LhiUFXHQmKu0utxgBa1ttoKwat3KIFt2B5vskrT82ekR5B8sbSzE51VjZHy3T7Q62P`,
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: relawanApk_id, // The _id of the document to update
                set: {
                  umur: relawanApk_userData.umur,
                  gender: relawanApk_userData.gender,
                  alamat: relawanApk_userData.alamat,
                  faskes: relawanApk_userData.faskes,
                  tb: relawanApk_userData.tb,
                  bb: relawanApk_userData.bb,
                  keluhan: relawanApk_userData.keluhan,
                  telepon: relawanApk_userData.telepon,
                },
              },
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user in Sanity');
      }
  
      const data = await response.json();
      console.log('User created:', data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const [formUpdate, setFormUpdate] = useState({
    umur: "",
    gender: "",
    alamat: "",
    faskes: "",
    tb: "",
    bb: "",
    keluhan: "",
    telepon: "",
  });

  useEffect(() => {
    setFormUpdate({
      umur: serverData?.data[0]?.umur || "",
      gender: serverData?.data[0]?.gender || "Jenis Kelamin",
      alamat: serverData?.data[0]?.alamat || "",
      faskes: serverData?.data[0]?.faskes || "",
      tb: serverData?.data[0]?.tb || "",
      bb: serverData?.data[0]?.bb || "",
      keluhan: serverData?.data[0]?.keluhan || "",
      telepon: serverData?.data[0]?.telepon || "",
    });
  }, [serverData]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormUpdate({ ...formUpdate, [name]: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Send POST request to your Sanity backend to create a new user
      await updateSanityUser(formUpdate);

      message.success("Update biodata berhasil.")
      navigate('/screening');

    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
  return (
    <>
      <section>
        <div className="lg:flex">
          <div className="lg:w-1/2">
            <RandomBG />
          </div>
          <div className="lg:w-1/2 lg:py-0 py-10 flex items-center">
            <form className="w-full lg:px-28 px-4 items-center" onSubmit={handleSubmit}>
              <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <span className="text-sm">({relawanApk_userData[0]?.name})</span></h2>
              <Input
                type="text"
                name="umur"
                placeholder="Umur"
                size="large"
                className="mb-4 border"
                value={formUpdate.umur}
                onChange={handleUpdateChange}
                required
              />
              {/* <Input
                type="text"
                name="gender"
                placeholder="Jenis Kelamin"
                size="large"
                className="mb-4 border"
                value={formUpdate.gender}
                onChange={handleUpdateChange}
              /> */}
              <Select
                defaultValue="Laki-laki"
                name="gender"
                size="large"
                className="mb-4 w-full"
                placeholder="Jenis Kelamin"
                required
                value={formUpdate.gender}
                onChange={(value) => setFormUpdate({ ...formUpdate, gender: value })}
              >
                <Option value="Laki-laki">Laki-laki</Option>
                <Option value="Perempuan">Perempuan</Option>
              </Select>
              <Input
                type="text"
                name="alamat"
                placeholder="Alamat"
                size="large"
                className="mb-4 border"
                value={formUpdate.alamat}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="faskes"
                placeholder="Fasyankes yang digunakan"
                size="large"
                className="mb-4 border"
                value={formUpdate.faskes}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="tb"
                placeholder="Tinggi Badan"
                size="large"
                className="mb-4 border"
                value={formUpdate.tb}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="bb"
                placeholder="Berat Badan"
                size="large"
                className="mb-4 border"
                value={formUpdate.bb}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="keluhan"
                placeholder="Keluhan Saat Ini"
                size="large"
                className="mb-4 border"
                value={formUpdate.keluhan}
                onChange={handleUpdateChange}
              />
              <Input
                type="number"
                name="telepon"
                placeholder="Nomor Telepon"
                size="large"
                className="mb-8 border"
                value={formUpdate.telepon}
                onChange={handleUpdateChange}
              />
              <Button
                className="text-white bg-rose-700 w-full"
                htmlType="submit"
                size="large"
              >
                Submit
              </Button>
              <p className="flex justify-center text-sm font-light mt-8 text-gray-500">
                <Link to="/home" className="text-rose-700"> Back to Home</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Biodata