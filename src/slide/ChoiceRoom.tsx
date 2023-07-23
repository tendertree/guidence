import { useState } from "react";
import Searchbar from "../components/SearchBar";
import Gallery_Button from "../components/Gallery_Button";
import Icon_label from "../components/Icon_label";
import { useQuery } from "@tanstack/react-query";

interface ChoiceRoomProp {
	metaverse: string;
}

const ChoiceRoom = () => {
	const metaverse = "ustory"
	const imagePath = "/room/" + metaverse + "/"
	const [filterOptions, setFilterOptions] = useState(["sns", "home", "talk", "edu"]);
	const [search, setSearch] = useState("");
	const [room, setRoom] = useState({ name: "", desc: "", link: "" });
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target;
		if (checked) {
			setFilterOptions((prevOptions) => [...prevOptions, value]);
		} else {
			setFilterOptions((prevOptions) =>
				prevOptions.filter((option) => option !== value)
			);
		}
	};

	const { data, isLoading, error } = useQuery(['jsonData', { filter: { metaverse } }], () =>
		fetch('/room/ustory.json')
			.then((response) => response.json())
	);
	const applyFilters = () => {
		// Filter the data using the selected filterOptions
		const filteredData = data.filter((item: any) =>
			item.category.some((cat: string) => filterOptions.includes(cat))
			&&
			(search.trim() === "" ||
				item.name.toLowerCase().includes(search.toLowerCase()))



		);
		console.log(filteredData);

		return filteredData;
	};



	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error</div>;
	}
	if (!data) {
		return <div>Item not found!</div>;
	}
	const filteredData = applyFilters();



	const showModal = (name: string) => {

		let choiceItem = filteredData.find(item => item.name === name);
		setRoom(choiceItem);
		window.my_modal.showModal()

	}

	return (
		<>
			<div className="form-control flex flex-row justify-center">
				<Icon_label icon="home" name="모임" handleChange={handleCheckboxChange} checked={filterOptions.includes("home")} />
				<Icon_label icon="edu" name="교육" handleChange={handleCheckboxChange} checked={filterOptions.includes("edu")} />
				<Icon_label icon="sns" name="홍보" handleChange={handleCheckboxChange} checked={filterOptions.includes("sns")} />
				<Icon_label icon="talk" name="상담" handleChange={handleCheckboxChange} checked={filterOptions.includes("talk")} />
			</div>

			<div className="mx-auto flex justify-center bg-green-100">
				<Searchbar search={search} setSearch={setSearch} />

			</div>
			<div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5 px-5">
					{filteredData.map((item: any) => (
						<Gallery_Button name={item.name} img={imagePath + item.name + '.png'} show={showModal} />
					))}
				</div>

				<div className="flex flex-row mx-auto items-center justify-center mt-2">
					<a className="btn  group px-12 normal-case mx-5">
						<span className=" inline">이전</span>
					</a>

				</div>
			</div >
			{/* You can open the modal using ID.showModal() method */}
			< dialog id="my_modal" className="modal" >
				<form method="dialog" className="modal-box">
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					<h3 className="font-bold text-lg">{room.name}</h3>
					<img src={imagePath + room.name + '.png'} className="rounded-xl" />
					<a className="btn btn-neutral mt-3" target="_blank" href={room.link}>
						<img src="/icon/see_white.svg" className="w-5" />
						구경하기
					</a>
					<div className="flex flex-row justify-between">
						<p className="py-4">{room.desc}</p>
						<div className="relative ">
							<button className="btn btn-neutral " >
								선택
							</button>
						</div>
					</div>
				</form>
			</dialog >
		</>
	)
}
export default ChoiceRoom;
