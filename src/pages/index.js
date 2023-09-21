import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchIcon from "@/icon/searchIcon";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [dataUser, setDataUser] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const fetchData = async (num) => {
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?page=${num}&pageSize=10&results=10`
      );
      setDataUser(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const searchData = async (name) => {
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?results=500`
      );
      // const data = response.data;
      // console.log(response.data.results);

      const filteredUser = response.data.results.filter(
        (user) =>
          user.name.first.toLowerCase() === name ||
          user.name.last.toLowerCase() === name
      );

      setDataUser(filteredUser);
    } catch (error) {
      console.error(error);
    }
  };

  const filterGender = async (gender) => {
    try {
      const response = await axios.get(
        `https://randomuser.me/api/?gender=${gender}&results=10`
      );
      setDataUser(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  function sortData(column) {
    let direction = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...dataUser].sort((a, b) => {
      const valueA = getNestedPropertyValue(a, column);
      const valueB = getNestedPropertyValue(b, column);

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    if (direction === "descending") {
      sortedData.reverse();
    }

    setDataUser(sortedData);
    setSortConfig({ key: column, direction });
  }

  function getNestedPropertyValue(obj, path) {
    const keys = path.split(".");
    return keys.reduce((value, key) => value[key], obj);
  }

  const handleSearchButton = () => {
    searchData(dataSearch.toLowerCase());
    setSearchShow(true);
    setSortConfig({ key: null, direction: "ascending" });
  };

  const handleResetButton = () => {
    setDataSearch("");
    setSearchShow(false);
    fetchData(1);
  };

  const handleJumpLink = (num) => {
    fetchData(num);
  };

  const handleFilterGender = (gender) => {
    filterGender(gender);
    setSortConfig({ key: null, direction: "ascending" });
  };

  useEffect(() => {
    if (!dataUser) {
      fetchData(1);
    }
  }, []);

  if (!dataUser) {
    return null;
  }

  function formatTanggal(inputDate) {
    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    return formattedDate;
  }

  return (
    <div
      className={`flex min-h-screen flex-col items-center px-24 py-8 ${inter.className}`}
    >
      <Head>
        <title>User Dashboard</title>
      </Head>
      <h1 className="text-3xl">User Dashboard</h1>
      <div className="my-10 space-x-7 flex w-[1000px]">
        <label className="block">
          <span className="block">Search</span>
          <div className="flex space-x-1">
            <input
              type="text"
              className="mt-1 px-3 py-2 text-black bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Search..."
              onChange={(e) => setDataSearch(e.target.value)}
            />
            <button
              className="bg-sky-500 mt-1 p-2 rounded-md"
              onClick={handleSearchButton}
            >
              <SearchIcon width="16" fill="#fff" />
            </button>
          </div>
        </label>
        <label className="block">
          <span className="block">Gender</span>
          <div className="flex space-x-1">
            <select
              onChange={(e) => handleFilterGender(e.target.value)}
              className="mt-1 px-3 py-2 text-black bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            >
              <option value="All" selected>
                All
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <button
              className="border w-48 mt-1 rounded-md"
              onClick={handleResetButton}
            >
              Reset Filter
            </button>
          </div>
        </label>
      </div>
      <table className="table-fixed w-[1000px]">
        <thead>
          <tr className="text-left bg-slate-700 border-b">
            <th
              role="button"
              onClick={() => sortData("login.username")}
              className="w-2/12 py-5"
            >
              <div className="flex justify-between">
                <p>Username</p>
                {sortConfig.key === "login.username" && (
                  <span className="mr-4">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              role="button"
              onClick={() => sortData("name.first")}
              className="w-2/12 py-5"
            >
              <div className="flex justify-between">
                <p>Name</p>
                {sortConfig.key === "name.first" && (
                  <span className="mr-4">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              role="button"
              onClick={() => sortData("email")}
              className="w-3/12 py-5"
            >
              <div className="flex justify-between">
                <p>Email</p>
                {sortConfig.key === "email" && (
                  <span className="mr-4">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              role="button"
              onClick={() => sortData("gender")}
              className="w-1/12 py-5"
            >
              <div className="flex justify-between">
                <p>Gender</p>
                {sortConfig.key === "gender" && (
                  <span className="mr-4">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              role="button"
              onClick={() => sortData("registered.date")}
              className="w-2/12 py-5"
            >
              <div className="flex justify-between">
                <p>Registeration Date</p>
                {sortConfig.key === "registered.date" && (
                  <span className="mr-4">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="text-white">
          {dataUser
            ? dataUser.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{user.login.username}</td>
                  <td className="py-4">{`${user.name.first} ${user.name.last}`}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">{user.gender}</td>
                  <td className="py-4">
                    {formatTanggal(user.registered.date)}
                  </td>
                </tr>
              ))
            : null}
          {searchShow && dataUser.length === 0 ? (
            <div className="py-4">there is no data match</div>
          ) : null}
        </tbody>
      </table>
      {searchShow ? null : (
        <div className="py-4 space-x-2">
          <button onClick={() => handleJumpLink(1)} className="border w-8 h-8">
            1
          </button>
          <button onClick={() => handleJumpLink(2)} className="border w-8 h-8">
            2
          </button>
          <button onClick={() => handleJumpLink(3)} className="border w-8 h-8">
            3
          </button>
        </div>
      )}
    </div>
  );
}
