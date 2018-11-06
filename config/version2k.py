from datetime import date
from datetime import timedelta
import sys
if len(sys.argv) > 1:
  try:
    print date(2000,01,01)+timedelta(days=int(sys.argv[1]))
  except:
    print 'Invalid argument'
else:
  print (date.today()-date(2000,01,01)).days
