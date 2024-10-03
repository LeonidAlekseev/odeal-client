import { type PropsWithChildren } from "react";

type Props = {
  params: { id: string };
};

export default async function Layout({
  children,
  params,
}: PropsWithChildren<Props>) {
  return (
    <div className="container pt-6 mx-auto">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl lg:text-7xl lg:leading-[80px] font-bold text-white">
            <div>Страхование</div>
            <div>Это легко!</div>
          </h1>
          <h2 className="text-xl lg:text-3xl lg:leading-10 text-white mt-2">
            Безопасность — наш&nbsp;приоритет
          </h2>
        </div>
        <img
          className="aspect-[444/384] w-[222px] lg:w-[444px]"
          src="/images/plate.png"
          alt="Plate with pasta"
        />
      </div>
      <div className="bg-white rounded-t-[36px] rounded-b-[20px]">
        {children}
      </div>
    </div>
  );
}
