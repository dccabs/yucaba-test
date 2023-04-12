type LoadingType = {
  loading: boolean;
}

const Loading = ({ loading }: LoadingType) => {
  return (
    <div className={`fixed inset-0 z-50 ${loading ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Loading...</h2>
        </div>
      </div>
    </div>
  );
};

export default Loading;