export const HeadFilter = (props: { ButtonModal: React.ReactNode, filterMain: React.ReactNode, filterSecond?: React.ReactNode }) => (
    <div className="col-span-4 bg-white p-4 flex gap-5 rounded-xl items-center justify-between">
        <div className="flex gap-5">
            <div className="flex gap-5 flex-1 w-100" id="filter-main">
                {props.filterMain}
            </div>
            {props.filterSecond && <div className="flex gap-5 border-l pl-5 border-gray-200 flex-1" id="filter-second">
                {props.filterSecond}
            </div>}

        </div>
        {props.ButtonModal}
    </div>
)