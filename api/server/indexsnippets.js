//generatetradingpairs();

//let isGeneratingOrder = false;

cron.schedule("*/10 * * * * *", async () => {
    if (!isGeneratingOrder) {
      isGeneratingOrder = true;
  
      try {
        await generateorder();
      } catch (error) {
        console.error('Error during order generation:', error);
      }
  
      isGeneratingOrder = false;
    } else {
      console.log('Previous operation still running. Skipping new execution.');
    }
  });
  
  cron.schedule("*/1 * * * *", async () => {
    const date = Date.now();
    await getprices(date);
  
    //await getBitcoinBalances();
  });