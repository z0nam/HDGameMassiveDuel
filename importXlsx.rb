require 'simple_xlsx_reader'

doc = SimpleXlsxReader.open("/Users/joonkim/Desktop/sample_hd_template.xlsx")
student = {}
student[:studentId] = doc.sheets[0].rows[3][2]
student[:name] = doc.sheets[0].rows[4][2]


# DH와 확률을 배열로 조합
def makeProb(row, index)
  myArray = []
  return nil if row[index].nil?
  myArray.push(row[index].downcase, row[index+1].to_f)
  if myArray[0] == 'd' or 'h'
    if myArray[1] < 0
      myArray[1] = 0
    elsif myArray[1] > 1
      myArray[1] = 1
    end
  else
    myArray[0] = nil
    myArray[1] = nil
  end
  return myArray
end

# memory0
sheet = doc.sheets[1]
student[:init] = makeProb(sheet.rows[2], 1)

# memory1
sheet = doc.sheets[2]
sheet.rows[2..5].each do |row|
  key = row[0..1].join.downcase
  value = makeProb(row, 2)
  student[:"#{key}"] = value
end

# memory2
def makeStrategy(sheet, rowRange, dhLength, student)
  count = 0
  sheet.rows[2..17].each do |e|
    if (not e[4].nil?) and e[4].downcase == 'd' or 'h'
      count += 1
    end
  end
  if count == 0
    return nil
  end

  key = ""
  sheet.rows[rowRange].each do |row|
    if row[0].nil?
      key = key[0..dhLength-3] + row[dhLength-2..dhLength-1].join.downcase
    else
      key = row[0..dhLength-1].join.downcase
    end
    value = makeProb(row, dhLength)
    student[:"#{key}"] = value
  end
  return nil
end

makeStrategy(doc.sheets[3], 2..17, 4, student)
# makeStrategy(doc.sheets[4], 2..65, 6, student)
# makeStrategy(doc.sheets[5], 2..257, 8, student)
print student
puts
